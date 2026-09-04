import { Router, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { logger } from "../lib/logger";

const campaignsRouter: Router = Router();
const OUTPUTS_DIR = path.resolve(process.cwd(), "../../outputs");

interface Scene {
  scene_id: number;
  duration: number;
  visual: string;
  onscreen_text: string;
  voiceover: string;
  transition: string;
}

interface Campaign {
  id: string;
  title: string;
  concept: string;
  duration: number;
  score: number;
  hook: string;
  status: "Rendered" | "Approved" | "Processing";
  scenes: Scene[];
  disclaimer: string;
}

campaignsRouter.get("/campaigns", (req: Request, res: Response) => {
  try {
    const storyboardsDir = path.join(OUTPUTS_DIR, "storyboards");
    const qaDir = path.join(OUTPUTS_DIR, "qa");
    const videosDir = path.join(OUTPUTS_DIR, "videos");

    if (!fs.existsSync(storyboardsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(storyboardsDir).filter(f => f.endsWith(".json"));
    const campaigns: Campaign[] = [];

    for (const file of files) {
      const storyboardPath = path.join(storyboardsDir, file);
      const rawData = fs.readFileSync(storyboardPath, "utf-8");
      const sb = JSON.parse(rawData);

      const adId = sb.campaign || path.basename(file, ".json");
      
      // Check QA score if available
      let qaScore = 9.0;
      const qaPath = path.join(qaDir, `${adId}_qa.json`);
      if (fs.existsSync(qaPath)) {
        try {
          const qaData = JSON.parse(fs.readFileSync(qaPath, "utf-8"));
          if (qaData.score !== undefined) {
            qaScore = qaData.score;
          }
        } catch {}
      }

      // Check Video file status
      const videoPath = path.join(videosDir, `${adId}.mp4`);
      const isRendered = fs.existsSync(videoPath) && fs.statSync(videoPath).size > 0;

      const firstSceneText = sb.scenes && sb.scenes[0] ? sb.scenes[0].onscreen_text : "DYNAMIC AI AD";

      campaigns.push({
        id: adId,
        title: sb.title || `Campaign ${adId.toUpperCase()}`,
        concept: sb.concept || "AI Generated Video Strategy",
        duration: sb.duration_seconds || 40,
        score: qaScore,
        hook: firstSceneText,
        status: isRendered ? "Rendered" : "Processing",
        disclaimer: "CrowdWisdom is a research tool. Past market data does not guarantee future returns.",
        scenes: (sb.scenes || []).map((s: any) => ({
          scene_id: s.scene_id,
          duration: s.duration,
          visual: s.visual,
          onscreen_text: s.onscreen_text,
          voiceover: s.voiceover,
          transition: s.transition || "smooth cut",
        })),
      });
    }

    campaigns.sort((a, b) => a.id.localeCompare(b.id));
    return res.json(campaigns);
  } catch (error: any) {
    logger.error({ err: error }, "Failed to fetch dynamic campaigns");
    return res.status(500).json({ error: "Failed to fetch campaigns", details: error.message });
  }
});

campaignsRouter.post("/generate", (req: Request, res: Response) => {
  logger.info("Triggering dynamic AI Video Ads pipeline generation...");

  const rootProjectDir = path.resolve(process.cwd(), "../../");
  const command = `python -m app.main --mode demo --force-refresh`;

  exec(command, { cwd: rootProjectDir }, (error, stdout, stderr) => {
    if (error) {
      logger.error({ err: error, stderr }, "Pipeline generation failed");
      return res.status(500).json({ error: "Pipeline execution failed", details: stderr || error.message });
    }
    logger.info({ stdout }, "Pipeline generation finished successfully");
    return res.json({ success: true, message: "New video ad campaigns generated successfully!" });
  });
});

export default campaignsRouter;
