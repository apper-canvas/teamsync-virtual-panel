import mockData from '@/services/mockData/leaveRequests.json';

let leaveRequests = [...mockData];
let lastId = Math.max(...leaveRequests.map(req => req.Id), 0);

const leaveRequestService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...leaveRequests];
  },

  async getById(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    const request = leaveRequests.find(req => req.Id === id);
    return request ? { ...request } : null;
  },

  async create(requestData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newRequest = {
      ...requestData,
      Id: ++lastId,
      createdAt: new Date().toISOString()
    };
    
    leaveRequests.unshift(newRequest);
    return { ...newRequest };
  },

  async update(id, data) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = leaveRequests.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error(`Leave request with ID ${id} not found`);
    }

    // Remove Id from data to prevent modification
    const { Id, ...updateData } = data;
    leaveRequests[index] = { ...leaveRequests[index], ...updateData };
    return { ...leaveRequests[index] };
  },

  async delete(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID: must be a positive integer');
    }

    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = leaveRequests.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error(`Leave request with ID ${id} not found`);
    }

    const deleted = leaveRequests.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default leaveRequestService;