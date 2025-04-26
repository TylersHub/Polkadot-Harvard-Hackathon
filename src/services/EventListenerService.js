const { ethers } = require('ethers');
const GapFinance = require('../contracts/GapFinance.json');
const Project = require('../models/Project');

class EventListenerService {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(process.env.MOONBASE_RPC_URL);
        this.contract = new ethers.Contract(
            process.env.GAP_FINANCE_CONTRACT_ADDRESS,
            GapFinance.abi,
            this.provider
        );
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for new projects
        this.contract.on('ProjectCreated', async (projectId, owner, fundingGoal, event) => {
            console.log(`New project created: ${projectId}`);
            try {
                const project = await Project.findOne({ contractProjectId: projectId });
                if (project) {
                    project.status = 'active';
                    project.contractAddress = event.address;
                    await project.save();
                }
            } catch (error) {
                console.error('Error updating project status:', error);
            }
        });

        // Listen for new investments
        this.contract.on('InvestmentMade', async (projectId, investor, amount, event) => {
            console.log(`New investment in project ${projectId}`);
            try {
                const project = await Project.findOne({ contractProjectId: projectId });
                if (project) {
                    project.currentFunding += parseFloat(ethers.utils.formatEther(amount));
                    if (project.currentFunding >= project.fundingGoal) {
                        project.status = 'funded';
                    }
                    await project.save();
                }
            } catch (error) {
                console.error('Error updating investment:', error);
            }
        });

        // Error handling
        this.provider.on('error', (error) => {
            console.error('Provider error:', error);
            this.reconnect();
        });
    }

    async reconnect() {
        console.log('Attempting to reconnect...');
        this.provider = new ethers.providers.JsonRpcProvider(process.env.MOONBASE_RPC_URL);
        this.setupEventListeners();
    }
}

module.exports = new EventListenerService();