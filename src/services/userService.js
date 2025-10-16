const bcrypt = require('bcryptjs');
const { getDB } = require('../config/database');

class UserService {
  constructor() {
    this.collection = 'users';
  }

  // Create a new user
  async createUser(userData) {
    try {
      const db = getDB();
      const { name, email, password, role = 'user' } = userData;

      // Check if user already exists
      const existingUser = await db.collection(this.collection).findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection(this.collection).insertOne(newUser);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      userWithoutPassword._id = result.insertedId;

      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const db = getDB();
      const user = await db.collection(this.collection).findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  async findById(id) {
    try {
      const db = getDB();
      const user = await db.collection(this.collection).findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get all users with pagination
  async getAllUsers(page = 1, limit = 10) {
    try {
      const db = getDB();
      const skip = (page - 1) * limit;

      const users = await db.collection(this.collection)
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray();

      const total = await db.collection(this.collection).countDocuments({ isActive: true });
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(id, updateData) {
    try {
      const db = getDB();

      // Check if email already exists (if email is being updated)
      if (updateData.email) {
        const existingUser = await db.collection(this.collection).findOne({
          email: updateData.email,
          _id: { $ne: new ObjectId(id) }
        });
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }

      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      };

      const result = await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }

      // Return updated user
      const updatedUser = await this.findById(id);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete user
  async deleteUser(id) {
    try {
      const db = getDB();

      const result = await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            isActive: false,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        throw new Error('User not found');
      }

      return { message: 'User deactivated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new UserService();
