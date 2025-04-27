// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GapLoan {
    /* --------------------------------------------------------------------- */
    /*                                STORAGE                                */
    /* --------------------------------------------------------------------- */
    enum Currency { NATIVE, USDT, USDC }

    struct Loan {
        uint256 id;
        address borrower;

        uint256 principal;       // wei / token-units
        uint256 startBps;        // 1 bps = 0.01 %
        uint256 minBps;          // floor
        uint256 decayPerSec;     // bps lost per sec

        uint256 maturity;        // unix time (principal due)
        uint256 funded;          // total contributed
        bool    closed;

        Currency repaidIn;       // 0 until repaid
    }

    uint256 public nextId = 1;
    mapping(uint256 => Loan) public loans;                     // id → Loan
    mapping(uint256 => mapping(address => uint256)) public contributions; // id → (investor → amount)

    address public immutable usdt;
    address public immutable usdc;

    constructor(address _usdt, address _usdc) {
        usdt = _usdt;
        usdc = _usdc;
    }

    /* --------------------------------------------------------------------- */
    /*                                 EVENTS                                */
    /* --------------------------------------------------------------------- */
    event LoanCreated(uint256 id, address borrower);
    event Funded(uint256 id, address investor, uint256 amount, bool token);
    event Repaid(uint256 id, Currency currency);
    event Withdrawn(uint256 id, address investor, uint256 amount, Currency currency);

    /* --------------------------------------------------------------------- */
    /*                              VIEW HELPERS                             */
    /* --------------------------------------------------------------------- */
    function currentBps(uint256 id) public view returns (uint256) {
        Loan storage ln = loans[id];
        uint256 start = ln.maturity - ((ln.startBps - ln.minBps) / ln.decayPerSec);
        if (block.timestamp <= start) return ln.startBps;

        uint256 elapsed = block.timestamp > ln.maturity
            ? ln.maturity - start
            : block.timestamp - start;

        uint256 decayed = ln.startBps - elapsed * ln.decayPerSec;
        return decayed < ln.minBps ? ln.minBps : decayed;
    }

    /* --------------------------------------------------------------------- */
    /*                               ACTIONS                                 */
    /* --------------------------------------------------------------------- */

    /// borrower creates loan; chooses interest schedule
    function createLoan(
        uint256 principal,
        uint256 startBps,
        uint256 minBps,
        uint256 termDays
    ) external {
        require(startBps > minBps, "start<=min");
        uint256 termSecs = termDays * 1 days;
        uint256 decay = (startBps - minBps) / termSecs;

        loans[nextId] = Loan({
            id: nextId,
            borrower: msg.sender,
            principal: principal,
            startBps: startBps,
            minBps:   minBps,
            decayPerSec: decay,
            maturity: block.timestamp + termSecs,
            funded: 0,
            closed: false,
            repaidIn: Currency.NATIVE
        });
        emit LoanCreated(nextId, msg.sender);
        nextId++;
    }

    /* ---------- Funding ---------- */

    function fund(uint256 id) external payable {
        Loan storage ln = loans[id];
        require(!ln.closed, "closed");
        ln.funded += msg.value;
        contributions[id][msg.sender] += msg.value;
        emit Funded(id, msg.sender, msg.value, false);
    }

    function fundToken(uint256 id, uint256 amount, bool useUSDC) external {
        Loan storage ln = loans[id];
        require(!ln.closed, "closed");
        address token = useUSDC ? usdc : usdt;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        ln.funded += amount;
        contributions[id][msg.sender] += amount;
        emit Funded(id, msg.sender, amount, true);
    }

    /* ---------- Repayment ---------- */

    function _due(uint256 id) internal view returns (uint256) {
        Loan storage ln = loans[id];
        return ln.principal + (ln.principal * currentBps(id)) / 1e4;
    }

    /// repay in native ETH
    function repay(uint256 id) external payable {
        Loan storage ln = loans[id];
        require(msg.sender == ln.borrower, "not borrower");
        uint256 due = _due(id);
        require(msg.value >= due, "insufficient");
        ln.closed   = true;
        ln.repaidIn = Currency.NATIVE;
        emit Repaid(id, Currency.NATIVE);
    }

    /// repay in USDT/USDC
    function repayToken(uint256 id, bool useUSDC) external {
        Loan storage ln = loans[id];
        require(msg.sender == ln.borrower, "not borrower");
        uint256 due = _due(id);
        address token = useUSDC ? usdc : usdt;
        IERC20(token).transferFrom(msg.sender, address(this), due);
        ln.closed   = true;
        ln.repaidIn = useUSDC ? Currency.USDC : Currency.USDT;
        emit Repaid(id, ln.repaidIn);
    }

    /* ---------- Withdrawal ---------- */

    function withdraw(uint256 id) external {
        Loan storage ln = loans[id];
        require(ln.closed, "unpaid");
        uint256 paid = contributions[id][msg.sender];
        require(paid > 0, "no stake");

        uint256 totalDue = _due(id);
        uint256 amount   = (paid * totalDue) / ln.funded;
        contributions[id][msg.sender] = 0;

        if (ln.repaidIn == Currency.NATIVE) {
            payable(msg.sender).transfer(amount);
        } else {
            address token = (ln.repaidIn == Currency.USDC) ? usdc : usdt;
            IERC20(token).transfer(msg.sender, amount);
        }
        emit Withdrawn(id, msg.sender, amount, ln.repaidIn);
    }
}