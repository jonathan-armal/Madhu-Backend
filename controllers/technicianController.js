const ServiceRequest = require('../models/ServiceRequest');

exports.getAssignedRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ technician: req.user.userId, status: { $ne: 'completed' } })
      .populate('user', 'name email')
      .populate('product');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned requests', error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const serviceRequest = await ServiceRequest.findOneAndUpdate(
      { _id: req.params.id, technician: req.user.userId },
      { status },
      { new: true }
    );
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found or not assigned to you' });
    }
    res.json(serviceRequest);
  } catch (error) {
    res.status(400).json({ message: 'Error updating request status', error: error.message });
  }
};

