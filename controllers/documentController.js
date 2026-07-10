const { Restaurant, RestaurantDocument } = require('../models');

exports.uploadRestaurantDocuments = async (req, res) => {
  try {
    const { restaurant_id } = req.body;

    if (!restaurant_id) {
      return res.status(400).json({
        error: true,
        message: 'Restaurant ID is required.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        error: true,
        message: 'Restaurant not found or access denied.'
      });
    }

    if (!req.files || !req.files.fssai_license || !req.files.aadhaar_card || !req.files.shop_license) {
      return res.status(400).json({
        error: true,
        message: 'FSSAI license, Aadhaar card and Shop license are required.'
      });
    }

    const documentData = {
      restaurant_id,
      fssai_license: `/uploads/documents/${req.files.fssai_license[0].filename}`,
      aadhaar_card: `/uploads/documents/${req.files.aadhaar_card[0].filename}`,
      shop_license: `/uploads/documents/${req.files.shop_license[0].filename}`
    };

    let documents = await RestaurantDocument.findOne({
      where: { restaurant_id }
    });

    if (documents) {
      await documents.update({
        ...documentData,
        verification_status: 'pending'
      });
    } else {
      documents = await RestaurantDocument.create(documentData);
    }

    return res.status(201).json({
      error: false,
      message: 'Restaurant documents uploaded successfully. Verification is pending.',
      data: documents
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Document upload failed.',
      data: error.message
    });
  }
};