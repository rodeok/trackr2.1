import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  getDoc,
  where,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './config';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

export interface UserActivity {
  id?: string;
  userId: string;
  action: string;
  timestamp: Timestamp;
  details?: any;
}

// Get all users with pagination
export const getUsers = async (lastVisible = null, pageSize = 10) => {
  try {
    let usersQuery;
    
    if (lastVisible) {
      usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    
    const querySnapshot = await getDocs(usersQuery);
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() } as User);
    });
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { users, lastDoc };
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { uid: userSnap.id, ...userSnap.data() } as User;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

// Ban a user
export const banUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status: 'banned' });
    return true;
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
};

// Unban a user
export const unbanUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { status: 'active' });
    return true;
  } catch (error) {
    console.error("Error unbanning user:", error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Log user activity
export const logUserActivity = async (activity: Omit<UserActivity, 'id' | 'timestamp'>) => {
  try {
    const activityData = {
      ...activity,
      timestamp: Timestamp.now(),
    };
    
    await addDoc(collection(db, 'userActivities'), activityData);
    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

// Get user activities with pagination
export const getUserActivities = async (lastVisible = null, pageSize = 20, userId = null) => {
  try {
    let activitiesQuery;
    
    if (userId) {
      // Get activities for specific user
      if (lastVisible) {
        activitiesQuery = query(
          collection(db, 'userActivities'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        activitiesQuery = query(
          collection(db, 'userActivities'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(pageSize)
        );
      }
    } else {
      // Get all activities
      if (lastVisible) {
        activitiesQuery = query(
          collection(db, 'userActivities'),
          orderBy('timestamp', 'desc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      } else {
        activitiesQuery = query(
          collection(db, 'userActivities'),
          orderBy('timestamp', 'desc'),
          limit(pageSize)
        );
      }
    }
    
    const querySnapshot = await getDocs(activitiesQuery);
    const activities: UserActivity[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() } as UserActivity);
    });
    
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return { activities, lastDoc };
  } catch (error) {
    console.error("Error getting activities:", error);
    throw error;
  }
};