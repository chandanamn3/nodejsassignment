const express = require('express');
const userRouter = express.Router();
const User = require("./usermodel");

const createUser = async (req, res) => {
    try {
      console.log("req.body from create", req.body);
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }

    
  }


// Read All Employees
const getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll();
      res.json(users);
  } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Read User by ID
const getUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);

      if (!user) {
          res.status(404).json({ error: 'Employee not found' });
          return;
      }

      res.json(user);
  } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Update User by ID
const updateUserById = async (req, res) => {
  try {
      const userId = req.params.id;
      const [updatedRowsCount, updatedUser] = await User.update(req.body, {
          where: { id: userId },
          returning: true,
      });

      if (updatedRowsCount === 0) {
          res.status(404).json({ error: 'User not found' });
          return;
      }

      res.json(updatedUser[0]);
  } catch (error) {
      console.error('Error updating employee by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Delete User by ID
const deleteUserById = async (req, res) => {
  try {
      const UserId = req.params.id;
      const deletedRowsCount = await User.destroy({
          where: { id: UserId },
      });

      if (deletedRowsCount === 0) {
          res.status(404).json({ error: 'User not found' });
          return;
      }

      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      console.error('Error deleting User by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

userRouter.post("/",createUser);// Create Table  
userRouter.get("/", getAllUsers); // Read All
userRouter.get("/:id", getUserById); // Read by ID
userRouter.put("/:id", updateUserById); // Update by ID  
userRouter.delete("/:id", deleteUserById); // Delete by ID


  module.exports = {userRouter}