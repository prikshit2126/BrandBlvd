const Address = require("../models/Address");

// Add Address
const addAddress = async (req, res) => {

    try {

        if(req.body.isDefault){

            await Address.updateMany(
                {user:req.user.id},
                {$set:{isDefault:false}}
            );

        }

        const address = await Address.create({

            ...req.body,

            user:req.user.id

        });

        res.status(201).json({

            success:true,

            message:"Address added successfully",

            address

        });

    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Get Addresses

const getAddresses = async(req,res)=>{

    try{

        const addresses = await Address.find({

            user:req.user.id

        });

        res.json({

            success:true,

            addresses

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Update Address

const updateAddress = async(req,res)=>{

    try{

        if(req.body.isDefault){

            await Address.updateMany(

                {user:req.user.id},

                {$set:{isDefault:false}}

            );

        }

        const address = await Address.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new:true

            }

        );

        res.json({

            success:true,

            address

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Delete Address

const deleteAddress = async(req,res)=>{

    try{

        await Address.findByIdAndDelete(req.params.id);

        res.json({

            success:true,

            message:"Address deleted"

        });

    }

    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

module.exports={

    addAddress,

    getAddresses,

    updateAddress,

    deleteAddress

};