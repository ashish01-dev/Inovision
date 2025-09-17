import {
  type User,
  type InsertUser,
  type QuizResult,
  type InsertQuizResult,
  type College,
  type InsertCollege,
  type Timeline,
  type InsertTimeline,
  type SavedItem,
  type InsertSavedItem,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Stream category mapping for UI categories to actual streams
const STREAM_CATEGORY_MAPPING = {
  'Engineering': [
    'Computer Science', 'Electronics & Communication', 'Electrical Engineering', 
    'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Information Technology', 'Electronics & Instrumentation', 'Aerospace Engineering',
    'Automobile Engineering', 'Production Engineering', 'Mining Engineering',
    'Metallurgical Engineering', 'Petroleum Engineering', 'Mathematics & Computing',
    'Biotechnology', 'Data Science', 'Artificial Intelligence', 'Instrumentation & Control',
    'Manufacturing Process & Automation'
  ],
  'Medical': [
    'MBBS', 'BDS', 'BAMS', 'BHMS', 'BUMS', 'Nursing', 'Pharmacy', 
    'Physiotherapy', 'Medical Laboratory Technology', 'Radiology', 
    'Optometry', 'Veterinary Science'
  ],
  'Commerce': [
    'B.Com', 'BBA', 'Chartered Accountancy', 'Company Secretary', 
    'Cost & Management Accountancy', 'Banking & Finance', 
    'Business Management', 'Economics'
  ],
  'Arts': [
    'BA', 'Fine Arts', 'Literature', 'History', 'Political Science', 
    'Psychology', 'Sociology', 'Philosophy', 'Journalism', 
    'Mass Communication', 'Languages'
  ],
  'Science': [
    'B.Sc', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 
    'Environmental Science', 'Geology', 'Statistics', 'Zoology', 
    'Botany', 'Microbiology'
  ]
};

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Quiz Results
  getQuizResultsByUser(userId: string): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;

  // Colleges
  getColleges(): Promise<College[]>;
  getCollegesByLocation(location: string): Promise<College[]>;
  getCollegesByStream(stream: string): Promise<College[]>;
  getCollegesByType(type: string): Promise<College[]>;
  getCollegesFiltered(filters: {
    location?: string;
    stream?: string;
    type?: string;
  }): Promise<College[]>;
  getCollege(id: string): Promise<College | undefined>;
  createCollege(college: InsertCollege): Promise<College>;

  // Timelines
  getActiveTimelines(): Promise<Timeline[]>;
  getTimelinesByType(type: string): Promise<Timeline[]>;
  createTimeline(timeline: InsertTimeline): Promise<Timeline>;

  // Saved Items
  getSavedItemsByUser(userId: string): Promise<SavedItem[]>;
  createSavedItem(item: InsertSavedItem): Promise<SavedItem>;
  deleteSavedItem(userId: string, itemType: string, itemId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizResults: Map<string, QuizResult>;
  private colleges: Map<string, College>;
  private timelines: Map<string, Timeline>;
  private savedItems: Map<string, SavedItem>;

  constructor() {
    this.users = new Map();
    this.quizResults = new Map();
    this.colleges = new Map();
    this.timelines = new Map();
    this.savedItems = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Premier colleges from Northern India
    const sampleColleges: College[] = [
      // IIT Institutions
      {
        id: randomUUID(),
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi",
        state: "Delhi",
        type: "government",
        streams: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering", "Civil Engineering", "Mathematics & Computing"],
        facilities: ["Advanced Research Labs", "Central Library", "Hostel Accommodation", "Sports Complex", "Medical Center", "Innovation Hub", "Entrepreneurship Cell"],
        cutoffs: { general: 63, obc: 174, sc: 945, st: 1563 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Indian Institute of Technology Roorkee", 
        location: "Roorkee",
        state: "Uttarakhand",
        type: "government",
        streams: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering", "Electronics & Communication"],
        facilities: ["Central Library", "Hostel Accommodation", "Sports Facilities", "Research Centers", "Medical Facilities", "Workshop & Labs"],
        cutoffs: { general: 425, obc: 658, sc: 1540, st: 2856 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Indian Institute of Technology Mandi",
        location: "Kamand Valley, Mandi",
        state: "Himachal Pradesh", 
        type: "government",
        streams: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Data Science"],
        facilities: ["Modern Campus", "Research Labs", "Hostel", "Library", "Sports Complex", "Cafeteria"],
        cutoffs: { general: 2845, obc: 4256, sc: 8965, st: 12450 },
        isActive: true,
      },
      // NIT Institutions
      {
        id: randomUUID(),
        name: "National Institute of Technology Kurukshetra",
        location: "Kurukshetra",
        state: "Haryana",
        type: "government", 
        streams: ["Computer Science", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Information Technology"],
        facilities: ["Central Library", "Hostel Accommodation", "Computer Center", "Sports Complex", "Medical Center", "Workshops"],
        cutoffs: { general: 1245, obc: 2856, sc: 6785, st: 8965 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "National Institute of Technology Hamirpur",
        location: "Hamirpur",
        state: "Himachal Pradesh",
        type: "government",
        streams: ["Computer Science", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
        facilities: ["Library", "Hostels", "Computer Labs", "Workshop", "Sports Facilities", "Medical Center"],
        cutoffs: { general: 3456, obc: 5678, sc: 9876, st: 12345 },
        isActive: true,
      },
      // Delhi State Universities
      {
        id: randomUUID(),
        name: "Delhi Technological University",
        location: "Shahbad Daulatpur, Delhi",
        state: "Delhi",
        type: "government",
        streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Mathematics & Computing"],
        facilities: ["Modern Labs", "Central Library", "Hostel", "Sports Complex", "Innovation & Incubation Center", "Placement Cell"],
        cutoffs: { general: 1456, obc: 3789, sc: 8456, st: 11234 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Netaji Subhas University of Technology",
        location: "Dwarka, New Delhi",
        state: "Delhi", 
        type: "government",
        streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Instrumentation & Control", "Manufacturing Process & Automation"],
        facilities: ["Well-equipped Labs", "Library", "Hostel Facilities", "Sports Ground", "Auditorium", "Cafeteria"],
        cutoffs: { general: 2345, obc: 4567, sc: 9234, st: 12567 },
        isActive: true,
      },
      // Private Premier Institutions
      {
        id: randomUUID(),
        name: "Thapar Institute of Engineering & Technology",
        location: "Patiala",
        state: "Punjab",
        type: "private",
        streams: ["Computer Science", "Electronics & Communication", "Mechanical Engineering", "Chemical Engineering", "Civil Engineering", "Biotechnology"],
        facilities: ["State-of-art Labs", "Central Library", "Hostel Accommodation", "Sports Complex", "Innovation Labs", "Industry Interface"],
        cutoffs: { general: 78.5, obc: 75.2, sc: 68.5, st: 65.8 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Punjab Engineering College",
        location: "Chandigarh",
        state: "Punjab",
        type: "government-aided",
        streams: ["Computer Science", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Aerospace Engineering"],
        facilities: ["Advanced Labs", "Library", "Hostel", "Sports Facilities", "Workshop", "Research Centers"],
        cutoffs: { general: 2567, obc: 4123, sc: 8567, st: 11456 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Guru Gobind Singh Indraprastha University",
        location: "Kashmere Gate, Delhi", 
        state: "Delhi",
        type: "government",
        streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Law", "Management"],
        facilities: ["Campus Libraries", "Computer Labs", "Auditorium", "Sports Facilities", "Medical Center"],
        cutoffs: { general: 3456, obc: 5234, sc: 8901, st: 12345 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Jaypee Institute of Information Technology",
        location: "Noida",
        state: "Uttar Pradesh",
        type: "private",
        streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Biotechnology", "Mathematics & Computing"],
        facilities: ["Modern Infrastructure", "Digital Library", "Hostels", "Sports Complex", "Innovation Center", "Industry Partnerships"],
        cutoffs: { general: 75.6, obc: 72.3, sc: 65.4, st: 62.1 },
        isActive: true,
      },
      {
        id: randomUUID(),
        name: "Birla Institute of Technology Mesra",
        location: "Ranchi (Extension Campus in Delhi)",
        state: "Delhi",
        type: "private",
        streams: ["Computer Science", "Information Technology", "Electronics & Communication", "Mechanical Engineering", "Chemical Engineering"],
        facilities: ["Hi-tech Labs", "Library", "Hostel", "Sports", "Industry Interaction", "Research Facilities"],
        cutoffs: { general: 72.4, obc: 69.1, sc: 62.5, st: 59.2 },
        isActive: true,
      }
    ];

    // Sample timelines
    const sampleTimelines: Timeline[] = [
      {
        id: randomUUID(),
        title: "JEE Main Registration",
        description: "Registration deadline for JEE Main 2024 - Engineering entrance exam",
        type: "exam",
        deadline: new Date("2024-01-15"),
        streams: ["Engineering", "Technology"],
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "NEET Application",
        description: "Medical entrance exam application for MBBS/BDS courses",
        type: "exam",
        deadline: new Date("2024-02-01"),
        streams: ["Medical"],
        isActive: true,
      },
      {
        id: randomUUID(),
        title: "Scholarship Applications",
        description: "Various government and private scholarship opportunities available",
        type: "scholarship",
        deadline: new Date("2024-03-15"),
        streams: ["All"],
        isActive: true,
      },
    ];

    sampleColleges.forEach(college => this.colleges.set(college.id, college));
    sampleTimelines.forEach(timeline => this.timelines.set(timeline.id, timeline));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      profile: insertUser.profile || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Quiz Result methods
  async getQuizResultsByUser(userId: string): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(result => result.userId === userId);
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = randomUUID();
    const result: QuizResult = {
      ...insertResult,
      id,
      createdAt: new Date(),
      userId: insertResult.userId || null,
    };
    this.quizResults.set(id, result);
    return result;
  }

  // College methods
  async getColleges(): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(college => college.isActive);
  }

  async getCollegesByLocation(location: string): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(
      college => college.isActive && college.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async getCollegesByStream(stream: string): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(college => {
      if (!college.isActive || !Array.isArray(college.streams)) return false;
      
      const collegeStreams = college.streams as string[];
      
      // Check if it's a direct stream match
      if (collegeStreams.includes(stream)) return true;
      
      // Check if it's a category match
      const categoryStreams = STREAM_CATEGORY_MAPPING[stream as keyof typeof STREAM_CATEGORY_MAPPING];
      if (categoryStreams) {
        return categoryStreams.some(categoryStream => 
          collegeStreams.some(collegeStream => 
            collegeStream.toLowerCase().includes(categoryStream.toLowerCase()) ||
            categoryStream.toLowerCase().includes(collegeStream.toLowerCase())
          )
        );
      }
      
      return false;
    });
  }

  async getCollegesByType(type: string): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(
      college => college.isActive && college.type === type
    );
  }

  async getCollegesFiltered(filters: {
    location?: string;
    stream?: string;
    type?: string;
  }): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(college => {
      if (!college.isActive) return false;
      
      // Location filter
      if (filters.location && !college.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Type filter  
      if (filters.type && college.type !== filters.type) {
        return false;
      }
      
      // Stream filter (supports both specific streams and categories)
      if (filters.stream && Array.isArray(college.streams)) {
        const collegeStreams = college.streams as string[];
        
        // Check direct stream match
        if (collegeStreams.includes(filters.stream)) {
          // Direct match found, continue to check other filters
        } else {
          // Check category match
          const categoryStreams = STREAM_CATEGORY_MAPPING[filters.stream as keyof typeof STREAM_CATEGORY_MAPPING];
          if (categoryStreams) {
            const hasMatch = categoryStreams.some(categoryStream => 
              collegeStreams.some(collegeStream => 
                collegeStream.toLowerCase().includes(categoryStream.toLowerCase()) ||
                categoryStream.toLowerCase().includes(collegeStream.toLowerCase())
              )
            );
            if (!hasMatch) return false;
          } else {
            // If not a known category and not a direct match, filter out
            return false;
          }
        }
      }
      
      return true;
    });
  }

  async getCollege(id: string): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const id = randomUUID();
    const college: College = {
      ...insertCollege,
      id,
      isActive: true,
      facilities: insertCollege.facilities || [],
      cutoffs: insertCollege.cutoffs || {},
    };
    this.colleges.set(id, college);
    return college;
  }

  // Timeline methods
  async getActiveTimelines(): Promise<Timeline[]> {
    return Array.from(this.timelines.values())
      .filter(timeline => timeline.isActive)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }

  async getTimelinesByType(type: string): Promise<Timeline[]> {
    return Array.from(this.timelines.values()).filter(
      timeline => timeline.isActive && timeline.type === type
    );
  }

  async createTimeline(insertTimeline: InsertTimeline): Promise<Timeline> {
    const id = randomUUID();
    const timeline: Timeline = {
      ...insertTimeline,
      id,
      isActive: true,
      streams: insertTimeline.streams || [],
      description: insertTimeline.description || null,
    };
    this.timelines.set(id, timeline);
    return timeline;
  }

  // Saved Items methods
  async getSavedItemsByUser(userId: string): Promise<SavedItem[]> {
    return Array.from(this.savedItems.values()).filter(item => item.userId === userId);
  }

  async createSavedItem(insertItem: InsertSavedItem): Promise<SavedItem> {
    const id = randomUUID();
    const item: SavedItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      userId: insertItem.userId || null,
    };
    this.savedItems.set(id, item);
    return item;
  }

  async deleteSavedItem(userId: string, itemType: string, itemId: string): Promise<boolean> {
    const items = Array.from(this.savedItems.entries());
    const itemToDelete = items.find(([_, item]) => 
      item.userId === userId && item.itemType === itemType && item.itemId === itemId
    );
    
    if (itemToDelete) {
      this.savedItems.delete(itemToDelete[0]);
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
