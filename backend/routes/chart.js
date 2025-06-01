const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Get all system options - allow public access for read-only
router.get('/consultations', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const [consultationStats] = await Student.aggregate([
    {
        $project: {
        hasApproved: {
            $gt: [
            {
                $size: {
                $filter: {
                    input: '$consultations',
                    as: 'c',
                    cond: { $eq: ['$$c.status', 'approved'] }
                }
                }
            },
            0
            ]
        },
        hasPending: {
            $gt: [
            {
                $size: {
                $filter: {
                    input: '$consultations',
                    as: 'c',
                    cond: { $eq: ['$$c.status', 'pending'] }
                }
                }
            },
            0
            ]
        }
        }
    },
    {
        $group: {
        _id: null,
        approvedCount: { $sum: { $cond: ['$hasApproved', 1, 0] } },
        pendingCount: { $sum: { $cond: ['$hasPending', 1, 0] } }
        }
    }
    ]).exec();

    const result = {
        totalStudents,
        approved: consultationStats?.approvedCount || 0,
        pending: consultationStats?.pendingCount || 0
    };


    res.json(result);
  } catch (error) {
    console.error('Error getting semesters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/consultations/:adviser', async (req, res) => {
    try {
        const ObjectId = require('mongodb').ObjectId;
        const adviserId = new ObjectId(req.params.adviser);

        const [stats] = await Student.aggregate([
        {
            $addFields: {
            myConsultations: {
                $filter: {
                input: '$consultations',
                as: 'c',
                cond: { $eq: ['$$c.adviser', adviserId] }
                }
            }
            }
        },
        {
            $project: {
            hasApproved: {
                $gt: [
                {
                    $size: {
                    $filter: {
                        input: '$myConsultations',
                        as: 'c',
                        cond: { $eq: ['$$c.status', 'approved'] }
                    }
                    }
                },
                0
                ]
            },
            hasPending: {
                $gt: [
                {
                    $size: {
                    $filter: {
                        input: '$myConsultations',
                        as: 'c',
                        cond: { $eq: ['$$c.status', 'pending'] }
                    }
                    }
                },
                0
                ]
            },
            hasAny: {
                $gt: [{ $size: '$myConsultations' }, 0]
            }
            }
        },
        {
            $group: {
            _id: null,
            approvedCount: { $sum: { $cond: ['$hasApproved', 1, 0] } },
            pendingCount: { $sum: { $cond: ['$hasPending', 1, 0] } },
            totalAdvised: { $sum: { $cond: ['$hasAny', 1, 0] } }
            }
        }
        ]).exec();

        const result = {
            totalStudents: stats?.totalAdvised || 0,
            approved: stats?.approvedCount || 0,
            pending: stats?.pendingCount || 0
        };
        res.json(result)
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/attendance/:adviser/:start/:end/:class', async (req, res) => {
    try {
        const ObjectId = require('mongodb').ObjectId;
        const rawDate = new Date().toISOString().split('T')[0];
        const date = new Date(rawDate);

        const yourUserId = new ObjectId(req.params.adviser);
        const startDate = req.params.start !== '0' ? new Date(req.params.start) : new Date(date.setHours(0, 0, 0, 0));
        const endDate = req.params.end !== '0' ? new Date(req.params.end) : new Date(date.setHours(23, 59, 59, 999));
        const match = {
            adviser: yourUserId,
            date: { $gte: startDate, $lte: endDate },
        };
          
        // Add class filter only if req.params.class exists and is not empty
        if (req.params.class !== '0') {
            match.class = new ObjectId(req.params.class);
        }

        const attendanceStats = await Attendance.aggregate([
        {
            $match: match
        },
        { $unwind: '$records' },
        {
            $group: {
            _id: '$records.present',
            count: { $sum: 1 }
            }
        }
        ]).exec();

        const result = {
            present: attendanceStats.find(r => r._id === true)?.count || 0,
            absent: attendanceStats.find(r => r._id === false)?.count || 0
        };

        res.json(result);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;
