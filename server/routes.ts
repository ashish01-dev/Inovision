import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertSavedItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quiz Results API
  app.get("/api/quiz-results/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getQuizResultsByUser(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz results" });
    }
  });

  app.post("/api/quiz-results", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(validatedData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz result data" });
    }
  });

  // Colleges API
  app.get("/api/colleges", async (req, res) => {
    try {
      const { location, stream, type } = req.query;
      
      let colleges;
      if (location || stream || type) {
        // Use the comprehensive filtering method
        colleges = await storage.getCollegesFiltered({
          location: location as string,
          stream: stream && stream !== 'all' ? stream as string : undefined,
          type: type && type !== 'all' ? type as string : undefined,
        });
      } else {
        colleges = await storage.getColleges();
      }
      
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const college = await storage.getCollege(id);
      if (!college) {
        return res.status(404).json({ error: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch college" });
    }
  });

  // Timelines API
  app.get("/api/timelines", async (req, res) => {
    try {
      const { type } = req.query;
      
      let timelines;
      if (type) {
        timelines = await storage.getTimelinesByType(type as string);
      } else {
        timelines = await storage.getActiveTimelines();
      }
      
      res.json(timelines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timelines" });
    }
  });

  // Saved Items API
  app.get("/api/saved-items/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const items = await storage.getSavedItemsByUser(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved items" });
    }
  });

  app.post("/api/saved-items", async (req, res) => {
    try {
      const validatedData = insertSavedItemSchema.parse(req.body);
      const item = await storage.createSavedItem(validatedData);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid saved item data" });
    }
  });

  app.delete("/api/saved-items", async (req, res) => {
    try {
      const { userId, itemType, itemId } = req.body;
      const deleted = await storage.deleteSavedItem(userId, itemType, itemId);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Saved item not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete saved item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
