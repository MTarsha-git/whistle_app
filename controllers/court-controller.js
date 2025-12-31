const db = require('../models')

const getAllCourt = (req , res) =>{
    const courts = db.Court.findAll()
    .then((courts)=>{
    if(!courts){
        res.status(404).send({
            message:"you have no court"
        });
    }else{
        res.status(200).send({
            message:"courts fetched successfully",
            data:courts
        });
    }
}).catch((err)=> res.status(404).send(err.message));
};

const getOneCourt = async (req , res) => {
    try{
        const court = await db.Court.findOne({where:{id:req.params.id}});
        if(!court){
            res.status(404).send({
                message:"court not found"});
        }else{
            res.status(200).send({
                message:"court fetched successfully ",
                data:court
            });
        }

    } catch{
        res.status(400).send({
            message:"Error fetching court",
           error: err.message
        });

    }
};

const createCourt = async (req , res) => { 
    try{
        const newCourt = await db.Court.create({
            courtName : req.body.courtName,
            address : req.body.address
    });
    res.status(200).send({
        message : "court created successfully",
        data : newCourt
    });
    }catch{
        res.status(400).send({
            message : "error creating court",
            error : err.message
        });
    }
};

const deleteCourt = async (req , res) => {
    try{
        const court = await db.Court.findOne({where:{id:req.params.id}});
        if(!court){
            res.status(404).send({
                message : "court not found" 
            });
        }else{
            await court.destroy()
            res.status(200).send({
                message : "court deleted successfully"
            });
        }

    }catch{
        res.status(400).send({
            message : "error deleting court",
            error : err.message
        });

    }
};

const updateCourt = async (req , res) => {
    try{
        const court = await db.Court.findOne({where:{id:req.params.id}});
        if(!court) {
            res.status(404).send({
                message : "court not found"
            });
        } else {
            await court.update({
                courtName : req.body.courtName,
                address : req.body.address
            });
            res.status(200).send({
                message : "court info is updated",
                data : court
            });
        }
    }catch{
        res.status(400).send({
            message : "error updating court info",
            error : err.message
        })
    }
}

module.exports = {
    getAllCourt,
    getOneCourt,
    createCourt,
    deleteCourt,
    updateCourt
}