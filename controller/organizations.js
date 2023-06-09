const express = require('express');
const { addorganization, crtEmp, crtpermission, updateorg, getAllOrgData, deletedorg } = require("../utility/organization");
const route = express.Router();

//post 
route.post("/signup", async (req, res) => {
  try { 
     const { orgDetails, empData } = req.body;
    if(orgDetails && empData){
         const crtOrg = await addorganization(orgDetails);
         if(crtOrg?.sucess){
            const permissionCrt = await crtpermission({orgId:crtOrg?.orgs.id, name:"Admin", permissions:{All:true} });
            console.log(permissionCrt);
            if(permissionCrt?.sucess){
               const empCrt = await crtEmp({orgId:crtOrg?.orgs?.id, permissionId:permissionCrt?.permissions?.id,...empData});
               if(empCrt?.sucess){
                   //success
                    res.status(empCrt?.statusCode).json(empCrt);
               }else{
                   res.status(500).json("org created but failed to create user")
               }
             }
             else {
                 res.status(500).json("owner didn't get the access");
             }
         }
         else{
             res.status(crtOrg?.statusCode).json(crtOrg);
        }
    } 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
});
//
route.put("/:id", async (req, res) => {
  try{
     const orgdisplay = await updateorg(req?.params?.id,req?.body);
     console.log(orgdisplay);
     res.status(orgdisplay?.statusCode).json(orgdisplay);
  }catch (error) {
      console.log(error);
     res.status(500).json({ sucess: false, message: "internal server error", error: error.message});
  }
});
// get all
route.get("/", async (req, res)=> {
  try {
    const { offset=0, limit=null, s } = req.query;
    //console.log(offset=0, limit=null, s);
      const orgDetails = await  getAllOrgData( offset, limit, s);
      console.log({orgDetails});
      res.status(orgDetails?.statusCode).json(orgDetails);
  }catch (error) {
    console.log(error);
      res.status(500).json({ sucess: false, message: "internal server error", error: error.message});
  }
});

// get  by id
route.get("/:id", async (req, res)=> {
  try {
    const { offset=0, limit=null, s=null } = req.query;
      const orgDetails = await  getAllOrgData( offset,limit,s,req?.params?.id);
      console.log(orgDetails);
      res.status(orgDetails?.statusCode).json(orgDetails);
  }catch (error) {
      res.status(500).json({ sucess: false, message: "internal server error", error: error.message});
  }
});
//Delte by id
route.delete("/:id",  async (req, res) => {
  try{
      const deleteorg = await deletedorg(req?.params?.id);
      console.log(deleteorg);
      res.status(deleteorg?.statusCode).json(deleteorg);
   }catch (error) {
       console.log(error);
      res.status(500).json({ sucess: false, message: "internal server error", error: error.message});
   }

});


module.exports = route;