const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const OdysseyData = require('../models/Odyssey');
const SurveyData = require('../models/SurveyData');
const Student = require('../models/Student');

router.get('/:student', async (req, res) => {
  try {
    const activeSemester = await Semester.find({ status: 'active' });
    let odyssey = await OdysseyData.find({ status: 'submitted', studentId: req.params.student });

    res.json(odyssey);
  } catch (error) {
    console.error('Error getting odyssey:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create', authenticate, async (req, res) => {
  try {
    const { studentId, form } = req.body;
    const activeSemester = await Semester.find({ status: 'active' });

    const newOdyssey = new OdysseyData({
        form: form,
        studentId: studentId,
        semester: activeSemester[0]?._id
    });

    await newOdyssey.save();
    res.status(201).json({ message: 'Odyssey created successfully', odyssey: newOdyssey });
  } catch (error) {
    console.error('Error creating Odyssey:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/archive', authenticate, async (req, res) => {
    try {
        const odysseyId = req.body.odysseyId;
        const updateOdyssey = await OdysseyData.findById(odysseyId);

        updateOdyssey.status = 'inactive';
        await updateOdyssey.save();
        res.status(200);
    } catch (error) {
        console.error('Error updating Odyssey:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/archived/:id', authenticate, async (req, res) => {
    try {
        const studentId = req.params.id;
        // const archived = await OdysseyData.find({ studentId: studentId });
        const { ObjectId } = require('mongodb')

        const archived = await OdysseyData.aggregate([
        {
            $match: {
                studentId: new ObjectId(studentId)
            }
        },
        {
            $addFields: {
              semesterObjectId: { $toObjectId: "$semester" } // convert string to ObjectId
            }
          },
        {
            $lookup: {
                from: 'semesters',             // referenced collection
                localField: 'semesterObjectId',       // ObjectId in odyssey
                foreignField: '_id',          // ObjectId in Semester
                as: 'semester'
            }
        },
        {
            $unwind: '$semester'            // flatten the joined semester
        },
        ]).exec();

          

        res.status(200).json(archived);
    } catch (error) {
        console.error('Error fetching archived Odyssey:', error);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router;
