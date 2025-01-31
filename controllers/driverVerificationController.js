const DriverVerification = require('../models/mongodb/driver_verification');
const db = require("../models/mysql");
const User = db.users;

const driverVerificationController = {
    
  async submitVerification(req, res) {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingVerification = await DriverVerification.findOne({ user_id: user.id });
      if (existingVerification) {
        return res.status(400).json({ message: 'Driver verification already submitted' });
      }

      const verification = new DriverVerification({
        user_id: user.id,
        phone_number: user.phone_number,
        license_number: req.body.license_number,
        expiration_date: req.body.expiration_date
      });

      await verification.save();

      setTimeout(async () => {
        try {
          verification.is_verified = true;
          verification.verification_date = new Date();
          verification.updated_at = new Date();
          await verification.save();
          
          console.log(`User ${user.id} automatically verified as driver`);
        } catch (error) {
          console.error('Error in automatic verification:', error);
        }
      }, 10000); // 10 seconds

      res.status(201).json({
        message: 'Driver verification submitted successfully. Verification will be processed shortly.',
        verification
      });

    } catch (error) {
      console.error('Error in submitVerification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getVerificationStatus(req, res) {
    try {
      const verification = await DriverVerification.findOne({ user_id: req.user.id });
      
      if (!verification) {
        return res.status(404).json({ message: 'No verification found' });
      }

      res.json({ verification });

    } catch (error) {
      console.error('Error in getVerificationStatus:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async updateVerificationStatus(req, res) {
    try {
      const verification = await DriverVerification.findOne({ user_id: req.params.userId });
      
      if (!verification) {
        return res.status(404).json({ message: 'No verification found' });
      }

      verification.is_verified = req.body.is_verified;
      verification.verification_date = req.body.is_verified ? new Date() : null;
      verification.updated_at = new Date();

      await verification.save();

      res.json({
        message: 'Verification status updated successfully',
        verification
      });

    } catch (error) {
      console.error('Error in updateVerificationStatus:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = driverVerificationController;
