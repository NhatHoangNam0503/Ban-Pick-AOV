import React, { useState, useEffect, useRef } from 'react';
import { Shield, Swords, Ban, User, Check, RefreshCw, BookOpen, X, BrainCircuit, Target, Crosshair, Sparkles, Loader2, Zap, ShieldX, Info, Trophy, MessageCircle, Send, TrendingUp, Activity, PieChart, Bot, UserRound, ThumbsUp, ThumbsDown, History, Save, GraduationCap, Globe, Copy, Cross, Undo } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// --- FIREBASE SETUP ---
let app, auth, db, appId;
try {
  const firebaseConfig = {
  apiKey: "AIzaSyCaA3FYFCpgPM-_dE4N2XdLHaEAq7YR2Vg",
  authDomain: "ban-pick-aov-983fc.firebaseapp.com",
  projectId: "ban-pick-aov-983fc",
  storageBucket: "ban-pick-aov-983fc.firebasestorage.app",
  messagingSenderId: "242358708626",
  appId: "1:242358708626:web:4ea846c659d757dd80b94b",
  measurementId: "G-F1VKMNSDRN"
};
} catch (e) {
  console.error("Lỗi khởi tạo Firebase:", e);
}

const apiKey = ""; 

// --- DỮ LIỆU META & KHẮC CHẾ (TỪ TÀI LIỆU CSV & WEB) ---
const META_STATS = {
  // TIER S
  'Sinestrea': { tier: 'S', wr: 47.06, pr: 8.72, br: 85.13 }, 
  'Eland\'orr': { tier: 'S', wr: 57.14, pr: 21.54, br: 65.64 }, 
  'Rouie': { tier: 'S', wr: 55.10, pr: 25.13, br: 56.92 }, 
  'Omen': { tier: 'S', wr: 46.15, pr: 6.67, br: 47.69 }, 
  'Florentino': { tier: 'S', wr: 48.28, pr: 14.87, br: 45.64 }, 
  'Marja': { tier: 'S', wr: 57.89, pr: 29.23, br: 44.62 }, 
  // TIER A+
  'Capheny': { tier: 'A+', wr: 47.22, pr: 36.92, br: 3.59 }, 
  'Toro': { tier: 'A+', wr: 45.45, pr: 33.85, br: 29.74 }, 
  'Zephys': { tier: 'A+', wr: 56.25, pr: 32.82, br: 7.18 }, 
  'Hayate': { tier: 'A+', wr: 50.79, pr: 32.31, br: 23.08 }, 
  'Y\'bneth': { tier: 'A+', wr: 61.67, pr: 30.77, br: 22.56 }, 
  'Wisp': { tier: 'A+', wr: 51.67, pr: 30.77, br: 2.05 }, 
  'Qi': { tier: 'A+', wr: 48.78, pr: 21.03, br: 30.26 }, 
  'Violet': { tier: 'A+', wr: 56.67, pr: 15.38, br: 28.21 }, 
  'Murad': { tier: 'A+', wr: 48.15, pr: 13.85, br: 39.49 }, 
  // TIER A
  'Lorion': { tier: 'A', wr: 50.00, pr: 26.67, br: 12.82 }, 
  'Stuart (Joker)': { tier: 'A', wr: 50.98, pr: 26.15, br: 9.74 }, 
  'Thane': { tier: 'A', wr: 64.44, pr: 23.08, br: 4.62 }, 
  'Liliana': { tier: 'A', wr: 59.09, pr: 22.56, br: 4.62 }, 
  'Yena': { tier: 'A', wr: 60.98, pr: 21.03, br: 5.64 }, 
  'Billow': { tier: 'A', wr: 61.54, pr: 20.00, br: 13.33 }, 
  // TIER B
  'Keera': { tier: 'B', wr: 41.07, pr: 28.72, br: 4.62 }, 
  'TeeMee': { tier: 'B', wr: 49.06, pr: 27.18, br: 7.69 }, 
  'Richter': { tier: 'B', wr: 43.14, pr: 26.15, br: 4.10 }, 
  'Enzo': { tier: 'B', wr: 37.50, pr: 24.62, br: 14.87 }, 
  'Mganga': { tier: 'B', wr: 45.45, pr: 22.56, br: 15.38 }, 
  'Airi': { tier: 'B', wr: 52.78, pr: 18.46, br: 8.21 }, 
  'Iggy': { tier: 'B', wr: 62.96, pr: 13.85, br: 4.62 }, 
  'Zuka': { tier: 'B', wr: 57.69, pr: 13.33, br: 1.54 }, 
  'Moren': { tier: 'B', wr: 56.00, pr: 12.82, br: 12.31 }, 
  'Taara': { tier: 'B', wr: 56.00, pr: 12.82, br: 7.69 }, 
  'Gildur': { tier: 'B', wr: 55.00, pr: 10.26, br: 5.13 }, 
  'Aoi': { tier: 'B', wr: 50.00, pr: 10.26, br: 4.62 }, 
  // TIER C
  'Ryoma': { tier: 'C', wr: 47.37, pr: 19.49, br: 10.77 }, 
  'Yue': { tier: 'C', wr: 48.48, pr: 16.92, br: 5.64 }, 
  'Zata': { tier: 'C', wr: 36.36, pr: 16.92, br: 18.97 }, 
  'Tachi': { tier: 'C', wr: 30.00, pr: 15.38, br: 5.64 }, 
  'Ignis': { tier: 'C', wr: 48.28, pr: 14.87, br: 2.05 }, 
  'Skud': { tier: 'C', wr: 42.86, pr: 14.36, br: 7.69 }, 
  'Fennik': { tier: 'C', wr: 41.67, pr: 12.31, br: 1.03 }, 
  'Valhein': { tier: 'C', wr: 41.67, pr: 12.31, br: 1.54 }, 
  // TIER D & E & F
  'Cresht': { tier: 'D', wr: 41.18, pr: 8.72, br: 1.03 }, 
  'Annette': { tier: 'D', wr: 81.25, pr: 8.21, br: 3.59 }, 
  'Dolia': { tier: 'D', wr: 35.71, pr: 7.18, br: 14.87 }, 
  'Volkath': { tier: 'D', wr: 58.33, pr: 6.15, br: 12.31 }, 
  'Baldum': { tier: 'D', wr: 40.00, pr: 5.13, br: 1.03 }, 
  'Krizzix': { tier: 'D', wr: 40.00, pr: 5.13, br: 3.08 }, 
  'Maloch': { tier: 'D', wr: 30.00, pr: 5.13, br: 0.51 }, 
  'Azzen\'Ka': { tier: 'E', wr: 44.44, pr: 4.62, br: 1.54 }, 
  'Mina': { tier: 'E', wr: 33.33, pr: 4.62, br: 7.18 }, 
  'Yan': { tier: 'E', wr: 22.22, pr: 4.62, br: 0.51 }, 
  'Raz': { tier: 'E', wr: 37.50, pr: 4.10, br: 0.00 }, 
  'Wonder Woman': { tier: 'E', wr: 57.14, pr: 3.59, br: 1.03 }, 
  'Natalya': { tier: 'E', wr: 28.57, pr: 3.59, br: 1.03 }, 
  'Aya': { tier: 'E', wr: 66.67, pr: 3.08, br: 9.23 }, 
  'Slimz': { tier: 'E', wr: 50.00, pr: 3.08, br: 0.00 }, 
  'Wiro': { tier: 'E', wr: 50.00, pr: 3.08, br: 1.54 }, 
  'Chaugnar': { tier: 'E', wr: 100.00, pr: 2.56, br: 0.00 }, 
  'Tel\'Annas': { tier: 'F', wr: 75.00, pr: 2.05, br: 0.51 }, 
  'Grakk': { tier: 'F', wr: 50.00, pr: 2.05, br: 0.00 }, 
  'Flowborn (AD)': { tier: 'F', wr: 25.00, pr: 2.05, br: 1.03 }, 
  'Heino': { tier: 'F', wr: 25.00, pr: 2.05, br: 1.54 }, 
  'Tulen': { tier: 'F', wr: 100.00, pr: 1.54, br: 1.03 }, 
  'Zanis': { tier: 'F', wr: 100.00, pr: 1.54, br: 0.00 }, 
  'Elsu': { tier: 'F', wr: 66.67, pr: 1.54, br: 0.51 }, 
  'Arthur': { tier: 'F', wr: 33.33, pr: 1.54, br: 0.00 }
};

const PLAYSTYLE_COUNTERS = {
  "Cơ động": { counters: "Khống chế cứng (Khóa mục tiêu): Aleister, Arum, Omen, Gildur.", equip: "Áo choàng băng, Trượng băng, Khiên thất truyền.", tactic: "Giữ chiêu khống chế cứng lại, không tung bừa bãi. Chờ mục tiêu lướt vào tầm ngắm rồi mới khóa chết." },
  "Núp bụi / Bắt lẻ": { counters: "Cung cấp tầm nhìn / Bảo kê: Max, Elsu, Lindis, Zip, Krizzix.", equip: "Nhẫn phong thần, Quả cầu băng sương.", tactic: "Đi chung với Trợ thủ. Dùng chiêu hoặc trang bị check bụi trước khi qua sông." },
  "Sốc sát thương": { counters: "Bảo kê mạnh / Miễn thương: Helen, Aya, Dextra, Cresht.", equip: "Quả cầu băng sương, Giáp hộ mệnh, Nham thuẫn, Huân chương Troy.", tactic: "Chủ lực đi sát đội hình. Mua đồ out-play câu đi nhịp dồn sát thương đầu tiên của địch." },
  "Cấu rỉa": { counters: "Càn lướt / Mở giao tranh mạnh: Toro, Maloch, Nakroth, Paine.", equip: "Huân chương Troy, Giáp Gaia, Giáp thống khổ.", tactic: "Tuyệt đối không nhấp nhả. Chủ động mở giao tranh chớp nhoáng (ép góc, lao thẳng vào tuyến sau)." },
  "Giao tranh tổng": { counters: "Đẩy lẻ / Chia cắt đội hình: Omen, Nakroth, Rouie.", equip: "Đại địa mở trói, Giày kiên cường.", tactic: "Áp dụng chiến thuật 'Chia để trị' (4-1 hoặc 3-2). Tránh giao tranh ở địa hình hẹp." },
  "Outplay": { counters: "Khống chế tuyệt đối / Sốc sát thương: Arum, Aleister, Veera.", equip: "Đao truy hồn, Sách truy hồn.", tactic: "Không đánh dây dưa kéo dài. Dồn khống chế và sát thương hạ gục ngay lập tức." },
  "Càn lướt": { counters: "Sát thương chuẩn / Sát thương % máu: Hayate, Lauriel, Florentino.", equip: "Kiếm Fafnir, Mặt nạ Berith, Đao/Sách truy hồn, Xuyên giáp.", tactic: "Giữ khoảng cách (Hit & Run). Bỏ qua Đỡ đòn của địch nếu có cơ hội bắt vào tuyến sau." },
  "Bảo kê": { counters: "Sốc sát thương nhanh, Bắt lẻ (Batman, Veera, Kriknak).", equip: "Đao truy hồn, Sách truy hồn.", tactic: "Dồn sát thương hạ gục Trợ thủ/Người bảo kê trước nếu họ đứng lỗi vị trí." }
};

const HERO_PLAYSTYLES = {
  'Nakroth': ['Cơ động', 'Bắt lẻ', 'Giao tranh tổng'], 'Murad': ['Cơ động', 'Cấu rỉa', 'Outplay'], 'Ngộ Không': ['Núp bụi', 'Sốc sát thương'], 'Batman (Kaine)': ['Núp bụi', 'Sốc sát thương'],
  'Keera': ['Núp bụi', 'Sốc sát thương'], 'Quillen': ['Núp bụi', 'Sốc sát thương'], 'Aoi': ['Cơ động', 'Sốc sát thương'], 'Paine': ['Cơ động', 'Giao tranh tổng'],
  'Zill': ['Sốc sát thương', 'Outplay'], 'Florentino': ['Outplay', 'Càn lướt'], 'Yena': ['Núp bụi', 'Sốc sát thương', 'Giao tranh tổng'], 'Richter': ['Núp bụi', 'Giao tranh tổng'],
  'Omen': ['Bắt lẻ', 'Giao tranh tổng'], 'Lữ Bố': ['Càn lướt', 'Outplay'], 'Maloch': ['Giao tranh tổng', 'Cấu rỉa'], 'Toro': ['Càn lướt', 'Giao tranh tổng'],
  'Alice': ['Cấu rỉa', 'Bảo kê', 'Giao tranh tổng'], 'Helen': ['Bảo kê'], 'Zip': ['Bảo kê', 'Outplay'], 'Rouie': ['Cơ động', 'Giao tranh tổng'],
  'Elsu': ['Cấu rỉa', 'Cơ động'], 'Hayate': ['Cơ động', 'Cấu rỉa', 'Càn lướt'], 'Capheny': ['Cơ động', 'Giao tranh tổng'], 'Violet': ['Cơ động', 'Cấu rỉa'],
  'Veera': ['Núp bụi', 'Sốc sát thương'], 'Marja': ['Cấu rỉa', 'Outplay', 'Càn lướt'], 'Aleister': ['Giao tranh tổng', 'Bắt lẻ'], 'Iggy': ['Cấu rỉa', 'Giao tranh tổng'],
  'Erin': ['Cấu rỉa', 'Cơ động']
};

const getHeroPlaystyleInfo = (heroName, role) => {
  let styles = HERO_PLAYSTYLES[heroName];
  if (!styles) {
    // Fallback logic based on role if hero not in exact dictionary
    if (role === 'assassin') styles = ['Sốc sát thương', 'Cơ động'];
    else if (role === 'mage') styles = ['Cấu rỉa', 'Giao tranh tổng'];
    else if (role === 'marksman') styles = ['Giao tranh tổng'];
    else if (role === 'warrior') styles = ['Càn lướt'];
    else if (role === 'tank') styles = ['Càn lướt', 'Giao tranh tổng'];
    else styles = ['Bảo kê'];
  }
  const mainStyle = styles[0];
  return { styles: styles.join(', '), counterRule: PLAYSTYLE_COUNTERS[mainStyle] };
};

// --- LLM API CALLS ---
const generateAIAdvice = async (prompt) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: `Bạn là HLV Esports Liên Quân Mobile. BẢNG KHẮC CHẾ THEO LỐI CHƠI (Hãy dùng để tư vấn): ${JSON.stringify(PLAYSTYLE_COUNTERS)}. Hãy phân tích ngắn gọn, chiến thuật cao. Dùng **text** cho thuật ngữ quan trọng.` }] }
        }),
      });
      if (!response.ok) throw new Error("API call failed");
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ AI.";
    } catch (error) {
      if (i === 4) return "Lỗi kết nối AI. Vui lòng kiểm tra lại sau.";
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

const generateAIPrediction = async (prompt) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "Chấm điểm sức mạnh 2 đội Liên Quân. Đảm bảo winRate 2 đội cộng lại bằng 100." }] },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                blue: { type: "OBJECT", properties: { early: { type: "INTEGER" }, mid: { type: "INTEGER" }, late: { type: "INTEGER" }, combat: { type: "INTEGER" }, winRate: { type: "INTEGER" }, playstyle: { type: "STRING" } } },
                red: { type: "OBJECT", properties: { early: { type: "INTEGER" }, mid: { type: "INTEGER" }, late: { type: "INTEGER" }, combat: { type: "INTEGER" }, winRate: { type: "INTEGER" }, playstyle: { type: "STRING" } } },
                analysis: { type: "STRING" }
              }
            }
          }
        }),
      });
      if (!response.ok) throw new Error("API failed");
      const result = await response.json();
      return JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      if (i === 4) return null;
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

const generateAIPlayerAction = async (prompt) => {
  const delays = [1000, 2000, 4000, 8000, 16000];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "Bạn là HLV ĐỘI ĐỎ trong game Liên Quân. Ra quyết định CẤM hoặc CHỌN chuẩn xác. Trả về JSON." }] },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: { heroId: { type: "STRING" }, reason: { type: "STRING" } },
              required: ["heroId", "reason"]
            }
          }
        }),
      });
      if (!response.ok) throw new Error("API failed");
      const result = await response.json();
      return JSON.parse(result.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      if (i === 4) return null;
      await new Promise(r => setTimeout(r, delays[i]));
    }
  }
};

// --- CƠ SỞ DỮ LIỆU TƯỚNG ---
const HERO_DB = [
  { id: 'allain', name: 'Allain', role: 'warrior' }, { id: 'airi', name: 'Airi', role: 'warrior' }, { id: 'amily', name: 'Amily', role: 'warrior' }, { id: 'arthur', name: 'Arthur', role: 'warrior' }, { id: 'astrid', name: 'Astrid', role: 'warrior' }, { id: 'ata', name: 'Ata', role: 'warrior' }, { id: 'bijan', name: 'Bijan', role: 'warrior' }, { id: 'charlotte', name: 'Charlotte', role: 'warrior' }, { id: 'dextra', name: 'Dextra', role: 'warrior' }, { id: 'errol', name: 'Errol', role: 'warrior' }, { id: 'florentino', name: 'Florentino', role: 'warrior' }, { id: 'lubu', name: 'Lữ Bố', role: 'warrior' }, { id: 'maloch', name: 'Maloch', role: 'warrior' }, { id: 'max', name: 'Max', role: 'warrior' }, { id: 'omen', name: 'Omen', role: 'warrior' }, { id: 'qi', name: 'Qi', role: 'warrior' }, { id: 'richter', name: 'Richter', role: 'warrior' }, { id: 'roxie', name: 'Roxie', role: 'warrior' }, { id: 'ryoma', name: 'Ryoma', role: 'warrior' }, { id: 'skud', name: 'Skud', role: 'warrior' }, { id: 'superman', name: 'Superman', role: 'warrior' }, { id: 'tachi', name: 'Tachi', role: 'warrior' }, { id: 'toro', name: 'Toro', role: 'tank' }, { id: 'volkath', name: 'Volkath', role: 'warrior' }, { id: 'wiro', name: 'Wiro', role: 'warrior' }, { id: 'wonderwoman', name: 'Wonder Woman', role: 'warrior' }, { id: 'yan', name: 'Yan', role: 'warrior' }, { id: 'yena', name: 'Yena', role: 'warrior' }, { id: 'zuka', name: 'Zuka', role: 'warrior' },
  { id: 'aoi', name: 'Aoi', role: 'assassin' }, { id: 'batman', name: 'Batman (Kaine)', role: 'assassin' }, { id: 'billow', name: 'Billow', role: 'assassin' }, { id: 'butterfly', name: 'Butterfly', role: 'assassin' }, { id: 'enzo', name: 'Enzo', role: 'assassin' }, { id: 'keera', name: 'Keera', role: 'assassin' }, { id: 'kriknak', name: 'Kriknak', role: 'assassin' }, { id: 'murad', name: 'Murad', role: 'assassin' }, { id: 'nakroth', name: 'Nakroth', role: 'assassin' }, { id: 'ngokhong', name: 'Ngộ Không', role: 'assassin' }, { id: 'paine', name: 'Paine', role: 'assassin' }, { id: 'quillen', name: 'Quillen', role: 'assassin' }, { id: 'sinestrea', name: 'Sinestrea', role: 'assassin' }, { id: 'zill', name: 'Zill', role: 'assassin' }, { id: 'zhan', name: 'Zanis', role: 'assassin' }, { id: 'zephys', name: 'Zephys', role: 'assassin' },
  { id: 'aleister', name: 'Aleister', role: 'mage' }, { id: 'azzenka', name: 'Azzen\'Ka', role: 'mage' }, { id: 'bonnie', name: 'Bonnie', role: 'mage' }, { id: 'darcy', name: 'D\'Arcy', role: 'mage' }, { id: 'dieuthuyen', name: 'Điêu Thuyền', role: 'mage' }, { id: 'dirak', name: 'Dirak', role: 'mage' }, { id: 'flash', name: 'The Flash', role: 'mage' }, { id: 'flowborn_mage', name: 'Flowborn (Pháp sư)', role: 'mage' }, { id: 'hainguyet', name: 'Hải Nguyệt', role: 'mage' }, { id: 'heino', name: 'Heino', role: 'mage' }, { id: 'iggy', name: 'Iggy', role: 'mage' }, { id: 'ignis', name: 'Ignis', role: 'mage' }, { id: 'ilumia', name: 'Ilumia', role: 'mage' }, { id: 'ishar', name: 'Ishar', role: 'mage' }, { id: 'jinna', name: 'Jinna', role: 'mage' }, { id: 'kahlii', name: 'Kahlii', role: 'mage' }, { id: 'krixi', name: 'Krixi', role: 'mage' }, { id: 'lauriel', name: 'Lauriel', role: 'mage' }, { id: 'liliana', name: 'Liliana', role: 'mage' }, { id: 'lorion', name: 'Lorion', role: 'mage' }, { id: 'marja', name: 'Marja', role: 'mage' }, { id: 'mganga', name: 'Mganga', role: 'mage' }, { id: 'natalya', name: 'Natalya', role: 'mage' }, { id: 'preyta', name: 'Preyta', role: 'mage' }, { id: 'raz', name: 'Raz', role: 'mage' }, { id: 'tulen', name: 'Tulen', role: 'mage' }, { id: 'veera', name: 'Veera', role: 'mage' }, { id: 'yue', name: 'Yue', role: 'mage' }, { id: 'zata', name: 'Zata', role: 'mage' },
  { id: 'bright', name: 'Bright', role: 'marksman' }, { id: 'brunhilda', name: 'Celica', role: 'marksman' }, { id: 'capheny', name: 'Capheny', role: 'marksman' }, { id: 'elandorr', name: 'Eland\'orr', role: 'marksman' }, { id: 'elsu', name: 'Elsu', role: 'marksman' }, { id: 'fennik', name: 'Fennik', role: 'marksman' }, { id: 'flowborn_ad', name: 'Flowborn (AD)', role: 'marksman' }, { id: 'hayate', name: 'Hayate', role: 'marksman' }, { id: 'joker', name: 'Stuart (Joker)', role: 'marksman' }, { id: 'laville', name: 'Laville', role: 'marksman' }, { id: 'lindis', name: 'Lindis', role: 'marksman' }, { id: 'moren', name: 'Moren', role: 'marksman' }, { id: 'slimz', name: 'Slimz', role: 'marksman' }, { id: 'teeri', name: 'Teeri', role: 'marksman' }, { id: 'telannas', name: 'Tel\'Annas', role: 'marksman' }, { id: 'thorne', name: 'Thorne', role: 'marksman' }, { id: 'valhein', name: 'Valhein', role: 'marksman' }, { id: 'violet', name: 'Violet', role: 'marksman' }, { id: 'wisp', name: 'Wisp', role: 'marksman' }, { id: 'yorn', name: 'Yorn', role: 'marksman' }, { id: 'erin', name: 'Erin', role: 'marksman' },
  { id: 'alice', name: 'Alice', role: 'support' }, { id: 'annette', name: 'Annette', role: 'support' }, { id: 'arum', name: 'Arum', role: 'tank' }, { id: 'aya', name: 'Aya', role: 'support' }, { id: 'baldum', name: 'Baldum', role: 'tank' }, { id: 'chaugnar', name: 'Chaugnar', role: 'support' }, { id: 'cresht', name: 'Cresht', role: 'tank' }, { id: 'dolia', name: 'Dolia', role: 'support' }, { id: 'gildur', name: 'Gildur', role: 'tank' }, { id: 'grakk', name: 'Grakk', role: 'support' }, { id: 'helen', name: 'Helen', role: 'support' }, { id: 'krizzix', name: 'Krizzix', role: 'support' }, { id: 'lumburr', name: 'Lumburr', role: 'tank' }, { id: 'mina', name: 'Mina', role: 'tank' }, { id: 'ming', name: 'Ming', role: 'support' }, { id: 'omega', name: 'Omega', role: 'tank' }, { id: 'ormarr', name: 'Ormarr', role: 'tank' }, { id: 'rouie', name: 'Rouie', role: 'support' }, { id: 'sephera', name: 'Sephera', role: 'support' }, { id: 'taara', name: 'Taara', role: 'tank' }, { id: 'teemee', name: 'TeeMee', role: 'support' }, { id: 'thane', name: 'Thane', role: 'tank' }, { id: 'xeniel', name: 'Xeniel', role: 'tank' }, { id: 'ybneth', name: 'Y\'bneth', role: 'tank' }, { id: 'zip', name: 'Zip', role: 'support' }
].sort((a, b) => a.name.localeCompare(b.name));

const ROLE_STYLES = { warrior: 'border-red-500 bg-red-900/30 text-red-300', mage: 'border-blue-500 bg-blue-900/30 text-blue-300', assassin: 'border-purple-500 bg-purple-900/30 text-purple-300', marksman: 'border-yellow-500 bg-yellow-900/30 text-yellow-300', support: 'border-green-500 bg-green-900/30 text-green-300', tank: 'border-gray-400 bg-gray-700/30 text-gray-300' };

const DRAFT_SEQUENCE = [
  { phase: 'BAN', team: 'BLUE' }, { phase: 'BAN', team: 'RED' }, { phase: 'BAN', team: 'BLUE' }, { phase: 'BAN', team: 'RED' },
  { phase: 'PICK', team: 'BLUE' }, { phase: 'PICK', team: 'RED' }, { phase: 'PICK', team: 'RED' }, { phase: 'PICK', team: 'BLUE' }, { phase: 'PICK', team: 'BLUE' }, { phase: 'PICK', team: 'RED' },
  { phase: 'BAN', team: 'RED' }, { phase: 'BAN', team: 'BLUE' }, { phase: 'BAN', team: 'RED' }, { phase: 'BAN', team: 'BLUE' },
  { phase: 'PICK', team: 'RED' }, { phase: 'PICK', team: 'BLUE' }, { phase: 'PICK', team: 'BLUE' }, { phase: 'PICK', team: 'RED' }
];

// --- COMPONENT PHỤ TRỢ ---
const ScoreBar = ({ label, value, colorClass }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs font-bold text-gray-300 mb-1"><span>{label}</span><span>{value}/100</span></div>
    <div className="w-full bg-gray-800 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${value || 0}%` }}></div>
    </div>
  </div>
);

const AiFeedbackWidget = ({ contextPrompt, aiResponse, messageId, user, db, appId, aiTab }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    if (!user || !db || !appId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'ai_feedback'), {
        messageId: messageId || Date.now().toString(),
        tab: aiTab, prompt: contextPrompt, response: aiResponse, isPositive: rating === 'up', comment: comment, timestamp: Date.now()
      });
      setSubmitted(true);
    } catch(e) { console.error("Lỗi gửi góp ý", e); }
    setIsSubmitting(false);
  };

  if (submitted) return <div className="text-emerald-400 text-xs mt-2 italic flex items-center gap-1"><Check className="w-3 h-3"/> Đã ghi nhận góp ý!</div>;
  return (
    <div className="mt-3 border-t border-gray-700/50 pt-2 flex flex-col gap-2">
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span>Nhận xét ý kiến này:</span>
        <button onClick={() => setRating('up')} className={`p-1 rounded transition-colors ${rating === 'up' ? 'text-emerald-400 bg-emerald-900/30' : 'hover:bg-gray-700'}`}><ThumbsUp className="w-4 h-4"/></button>
        <button onClick={() => setRating('down')} className={`p-1 rounded transition-colors ${rating === 'down' ? 'text-red-400 bg-red-900/30' : 'hover:bg-gray-700'}`}><ThumbsDown className="w-4 h-4"/></button>
      </div>
      {rating && (
        <div className="flex gap-2 items-center">
          <input type="text" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Góp ý chi tiết để AI thông minh hơn..." className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white outline-none focus:border-purple-500" />
          <button onClick={submitFeedback} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs disabled:opacity-50 flex items-center gap-1">
             {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>} Gửi
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [gameMode, setGameMode] = useState('LOCAL');
  
  // Online States
  const [roomId, setRoomId] = useState("");
  const [joinRoomIdInput, setJoinRoomIdInput] = useState("");
  const [myTeam, setMyTeam] = useState(null); 
  const [roomStatus, setRoomStatus] = useState(""); 
  const [showLobbyModal, setShowLobbyModal] = useState(false);

  // Local Game States 
  const [turnIndex, setTurnIndex] = useState(0);
  const [blueBans, setBlueBans] = useState([]); 
  const [redBans, setRedBans] = useState([]);   
  const [bluePicks, setBluePicks] = useState([]); 
  const [redPicks, setRedPicks] = useState([]);   
  const [selectedHero, setSelectedHero] = useState(null);
  const [filterRole, setFilterRole] = useState('ALL');

  // AI & Training States
  const [aiPlaying, setAiPlaying] = useState(false);
  const [aiPlayReason, setAiPlayReason] = useState("");
  const [showAiTrainInput, setShowAiTrainInput] = useState(false);
  const [aiTrainText, setAiTrainText] = useState("");
  const [globalAiRules, setGlobalAiRules] = useState([]); 

  const [showTierList, setShowTierList] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiTab, setAiTab] = useState("GENERAL");
  
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);

  const [savedMatches, setSavedMatches] = useState([]);

  const currentStep = turnIndex < DRAFT_SEQUENCE.length ? DRAFT_SEQUENCE[turnIndex] : null;
  const isFinished = turnIndex >= DRAFT_SEQUENCE.length;
  const lockedHeroes = [...blueBans, ...redBans, ...bluePicks, ...redPicks].filter(Boolean).map(h => h.id);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
        else await signInAnonymously(auth);
      } catch (err) { console.error("Lỗi đăng nhập:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const chatRef = doc(db, 'artifacts', appId, 'users', user.uid, 'user_data', 'chat_history');
    const unsubChat = onSnapshot(chatRef, (docSnap) => { if (docSnap.exists()) setChatHistory(docSnap.data().messages || []); });

    const matchRef = collection(db, 'artifacts', appId, 'users', user.uid, 'match_history');
    const unsubMatch = onSnapshot(matchRef, (snap) => {
       let history = []; snap.forEach(d => history.push({id: d.id, ...d.data()}));
       history.sort((a,b) => b.timestamp - a.timestamp); setSavedMatches(history);
    });

    const globalRulesRef = collection(db, 'artifacts', appId, 'public', 'data', 'global_ai_rules');
    const unsubGlobalRules = onSnapshot(globalRulesRef, (snap) => {
       let rules = []; snap.forEach(d => rules.push({id: d.id, ...d.data()}));
       rules.sort((a,b) => b.timestamp - a.timestamp); 
       setGlobalAiRules(rules.slice(0, 15)); 
    });

    return () => { unsubChat(); unsubMatch(); unsubGlobalRules(); };
  }, [user]);

  useEffect(() => {
    if (!user || !db || gameMode !== 'ONLINE' || !roomId) return;
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId);
    const unsubRoom = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRoomStatus(data.status); setTurnIndex(data.turnIndex);
        setBlueBans(data.blueBans || []); setRedBans(data.redBans || []);
        setBluePicks(data.bluePicks || []); setRedPicks(data.redPicks || []);
      } else setRoomStatus("CLOSED");
    });
    return () => unsubRoom();
  }, [roomId, gameMode, user]);

  const handleCreateRoom = async () => {
    if (!user || !db) return;
    const newRoomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'rooms', newRoomId), {
        status: 'WAITING', hostId: user.uid, turnIndex: 0, blueBans: [], redBans: [], bluePicks: [], redPicks: [], timestamp: Date.now()
      });
      setRoomId(newRoomId); setMyTeam('BLUE'); setGameMode('ONLINE'); setJoinRoomIdInput("");
    } catch(e) { console.error("Lỗi tạo phòng:", e); }
  };

  const handleJoinRoom = async () => {
    if (!user || !db || !joinRoomIdInput.trim()) return;
    const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', joinRoomIdInput.toUpperCase());
    try {
      const snap = await getDoc(roomRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === 'WAITING' && data.hostId !== user.uid) {
          await updateDoc(roomRef, { status: 'PLAYING', guestId: user.uid });
          setRoomId(joinRoomIdInput.toUpperCase()); setMyTeam('RED'); setGameMode('ONLINE'); setShowLobbyModal(false);
        } else if (data.hostId === user.uid) {
          setRoomId(joinRoomIdInput.toUpperCase()); setMyTeam('BLUE'); setGameMode('ONLINE'); setShowLobbyModal(false);
        }
      }
    } catch(e) { console.error("Lỗi vào phòng:", e); }
  };

  const lockHero = async (hero, overrideStep = null) => {
    const step = overrideStep || currentStep;
    if (!hero || !step) return;

    let newBlueBans = [...blueBans], newRedBans = [...redBans], newBluePicks = [...bluePicks], newRedPicks = [...redPicks];
    if (step.phase === 'BAN') {
      if (step.team === 'BLUE') newBlueBans.push(hero); else newRedBans.push(hero);
    } else {
      if (step.team === 'BLUE') newBluePicks.push(hero); else newRedPicks.push(hero);
    }

    if (gameMode === 'ONLINE' && roomId && user && db) {
      try {
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', roomId);
        await updateDoc(roomRef, { turnIndex: turnIndex + 1, blueBans: newBlueBans, redBans: newRedBans, bluePicks: newBluePicks, redPicks: newRedPicks });
        setSelectedHero(null);
      } catch(e) { console.error("Lỗi đồng bộ:", e); }
    } else {
      setBlueBans(newBlueBans); setRedBans(newRedBans); setBluePicks(newBluePicks); setRedPicks(newRedPicks);
      setTurnIndex(prev => prev + 1); setSelectedHero(null);
    }
  };

  const handleManualLockIn = () => {
    if (!selectedHero || !currentStep) return;
    if (gameMode === 'PVE' && currentStep.team === 'RED') return; 
    if (gameMode === 'ONLINE' && currentStep.team !== myTeam) return; 
    lockHero(selectedHero);
  };

  const handleUndo = () => {
    if (turnIndex === 0 || isFinished || gameMode === 'ONLINE') return;

    const prevIndex = turnIndex - 1;
    const prevStep = DRAFT_SEQUENCE[prevIndex];

    if (prevStep.phase === 'BAN') {
      if (prevStep.team === 'BLUE') setBlueBans(prev => prev.slice(0, -1));
      else setRedBans(prev => prev.slice(0, -1));
    } else {
      if (prevStep.team === 'BLUE') setBluePicks(prev => prev.slice(0, -1));
      else setRedPicks(prev => prev.slice(0, -1));
    }
    setTurnIndex(prevIndex);
    setSelectedHero(null);
    setAiPlayReason("");
  };

  const handleResetLocal = () => {
    setTurnIndex(0); setBlueBans([]); setRedBans([]); setBluePicks([]); setRedPicks([]);
    setSelectedHero(null); setAiResult(""); setAiTab("GENERAL"); 
    setPredictionData(null); setAiPlayReason(""); setShowAiTrainInput(false);
  };

  const handleSaveAiRule = async () => {
    if (!user || !db || !aiTrainText.trim()) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'global_ai_rules'), { 
        text: aiTrainText, authorId: user.uid, timestamp: Date.now() 
      });
      setAiTrainText(""); setShowAiTrainInput(false);
      setAiPlayReason("✅ Cộng đồng ghi nhận luật mới. HLV AI toàn cầu đã tiếp thu!");
      setTimeout(() => setAiPlayReason(""), 4000);
    } catch(e) { console.error("Lỗi lưu luật AI:", e); }
  };

  useEffect(() => {
    let isCancelled = false;
    const playAITurn = async () => {
      if (isFinished || !currentStep || currentStep.team !== 'RED' || gameMode !== 'PVE') return;
      setAiPlaying(true); setShowAiTrainInput(false);
      
      const availableIds = HERO_DB.map(h => h.id).filter(id => !lockedHeroes.includes(id));
      const isBan = currentStep.phase === 'BAN';
      
      const trainingInjection = globalAiRules.length > 0 ? `\nCÁC LUẬT TỪ NGƯỜI CHƠI: ${globalAiRules.map(r=>r.text).join('; ')}.` : '';
      const rebuttalLogic = `QUY TẮC PHẢN BIỆN: Dữ liệu Meta: ${JSON.stringify(META_STATS)}. Nếu người chơi ép bạn Chọn/Cấm tướng Tier S/A+/A vô lý, hãy dùng Tỉ lệ thắng(wr)/chọn(pr)/cấm(br) để PHẢN BIỆN lại trong "reason". Với tướng Tier B,C,D,E,F thì tuyệt đối nghe theo người chơi.`;

      const prompt = `
        BỐI CẢNH: Xanh: ${bluePicks.map(h=>h.name).join(', ')||'Chưa'}. Đỏ: ${redPicks.map(h=>h.name).join(', ')||'Chưa'}. Cấm: ${lockedHeroes.map(id => HERO_DB.find(h=>h.id===id)?.name).join(', ')||'Chưa'}.
        LƯỢT BẠN: ${isBan ? 'CẤM TƯỚNG (LOẠI BỎ)' : 'CHỌN TƯỚNG'}. TUYỆT ĐỐI KHÔNG NHẦM LẪN.
        ${trainingInjection} ${rebuttalLogic}
        List ID trống: ${availableIds.join(', ')}. Trả về heroId tối ưu nhất cho ĐỘI ĐỎ.
      `;
      
      const action = await generateAIPlayerAction(prompt);
      if (!isCancelled) {
        if (action && action.heroId && availableIds.includes(action.heroId)) {
          const hero = HERO_DB.find(h => h.id === action.heroId);
          lockHero(hero, currentStep);
          setAiPlayReason(`🤖 HLV AI: ${isBan ? 'Cấm' : 'Chọn'} ${hero.name}. ${action.reason}`);
        } else {
          const hero = HERO_DB.find(h => h.id === availableIds[Math.floor(Math.random() * availableIds.length)]);
          lockHero(hero, currentStep);
          setAiPlayReason(`🤖 HLV AI: ${isBan ? 'Cấm' : 'Chọn'} ${hero.name} (An toàn).`);
        }
        setAiPlaying(false);
      }
    };
    if (gameMode === 'PVE' && currentStep?.team === 'RED') {
      const timer = setTimeout(() => { playAITurn(); }, 1500);
      return () => { clearTimeout(timer); isCancelled = true; };
    }
  }, [turnIndex, gameMode, isFinished, globalAiRules]); 

  const saveChatToDB = async (newMessages) => {
    if (!user || !db) return;
    try { await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'user_data', 'chat_history'), { messages: newMessages }); } catch(e) {}
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', text: chatInput, id: Date.now().toString() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory); setChatInput(""); setAiLoading(true);

    const chatPrompt = `Tình trạng: Xanh [${bluePicks.map(h=>h.name).join(',')}] - Đỏ [${redPicks.map(h=>h.name).join(',')}]. BẢNG KHẮC CHẾ THEO LỐI CHƠI (Hãy dùng để tư vấn): ${JSON.stringify(PLAYSTYLE_COUNTERS)}. HLV Liên Quân, trả lời câu hỏi: "${userMessage.text}"`;
    const res = await generateAIAdvice(chatPrompt);
    
    const finalHistory = [...newHistory, { role: 'model', text: res, id: (Date.now()+1).toString() }];
    setChatHistory(finalHistory); saveChatToDB(finalHistory); setAiLoading(false);
  };
  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSendChat(); };

  const handlePredictAndSave = async () => {
    setShowPredictionModal(true); if (predictionData) return; setIsPredicting(true);
    const prompt = `Trận đấu Liên Quân. Xanh: ${bluePicks.map(h=>h.name).join(',')}. Đỏ: ${redPicks.map(h=>h.name).join(',')}. Chấm điểm chi tiết và dự đoán Tỉ lệ thắng.`;
    const data = await generateAIPrediction(prompt);
    if (data) {
      setPredictionData(data);
      if (user && db) {
        try { await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'match_history'), { blueTeam: bluePicks.map(h=>h.id), redTeam: redPicks.map(h=>h.id), prediction: data, timestamp: Date.now() }); } catch(e) {}
      }
    }
    setIsPredicting(false);
  };

  const [currentPromptForFeedback, setCurrentPromptForFeedback] = useState("");

  const fetchAiAdvice = async (type) => {
    setAiTab(type); if (type === 'CHAT') return; setAiLoading(true); setAiResult("");
    const teamTurn = currentStep ? (currentStep.team === 'BLUE' ? 'Đội Xanh' : 'Đội Đỏ') : 'Kết thúc';
    let prompt = `Tình trạng:\n- Xanh: ${bluePicks.map(h=>h.name).join(',')}\n- Đỏ: ${redPicks.map(h=>h.name).join(',')}\n- Cấm: ${lockedHeroes.map(id => HERO_DB.find(h=>h.id===id)?.name).join(',')}\n\n`;
    if (isFinished) {
      if (type === 'COMBO') prompt += `Phân tích combo. Đội nào có wombo combo tốt hơn?`;
      else if (type === 'COUNTER') prompt += `Chỉ ra các cặp đối đầu khắc chế trực tiếp.`;
      else if (type === 'BAN') prompt += `Đánh giá khâu Cấm của 2 đội. Có vị tướng nào hở ra lẽ ra nên bị cấm không?`;
      else prompt += `Phân tích tổng quan ưu nhược điểm và điều kiện thắng (win condition) của 2 đội.`;
    } else {
      prompt += `Hiện tại: ${teamTurn} đang ${currentStep.phase === 'BAN' ? 'CẤM' : 'CHỌN'}.\n\n`;
      if (type === 'COMBO') prompt += `Gợi ý 1-2 tướng CHỌN có khả năng kết hợp combo với ${teamTurn}.`;
      else if (type === 'COUNTER') prompt += `Gợi ý 1-2 tướng CHỌN cho ${teamTurn} để KHẮC CHẾ CỨNG đội hình địch.`;
      else if (type === 'BAN') prompt += `Gợi ý 1-2 tướng CẤM ngay lập tức nguy hiểm cho ${teamTurn}.`;
      else prompt += `Lời khuyên tổng quan nên ưu tiên lấy hoặc cấm vị trí nào tiếp theo.`;
    }
    setCurrentPromptForFeedback(prompt);
    const res = await generateAIAdvice(prompt);
    setAiResult(res || ""); setAiLoading(false);
  };

  const handleOpenAiCoach = () => { setAiModalOpen(true); if (!aiResult && aiTab !== 'CHAT') fetchAiAdvice(aiTab); };

  // --- RENDERING TIERS DYNAMICALLY DỰA TRÊN META_STATS ---
  const renderTierList = () => {
    const tiers = { 'S': [], 'A+': [], 'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [] };
    Object.keys(META_STATS).forEach(heroName => {
      const stat = META_STATS[heroName];
      if (tiers[stat.tier]) tiers[stat.tier].push({ name: heroName, ...stat });
    });

    const tierConfig = [
      { id: 'S', color: 'bg-red-600', text: 'text-red-400', border: 'border-red-500/30', bgTag: 'bg-red-900/40', title: 'Tướng Lỗi (Power Picks / Auto Ban)', desc: 'Bắt buộc cấm/chọn. Tỷ lệ cấm (BR) cực khủng trên 40%.' },
      { id: 'A+', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30', bgTag: 'bg-orange-900/40', title: 'Rất Mạnh (Top Meta)', desc: 'Lựa chọn ưu tiên có độ ổn định cực cao. Tỷ lệ chọn (PR) trên 30%.' },
      { id: 'A', color: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/30', bgTag: 'bg-yellow-900/40', title: 'Cân Bằng & Hiệu Quả', desc: 'Trục xương sống của đội hình. Tỷ lệ thắng (WR) thường trên 50%.' },
      { id: 'B', color: 'bg-green-600', text: 'text-green-400', border: 'border-green-500/30', bgTag: 'bg-green-900/40', title: 'Phổ Biến / Trung Bình', desc: 'Hiệu quả phụ thuộc lớn vào kỹ năng hoặc khắc chế đội hình địch.' },
      { id: 'C', color: 'bg-teal-600', text: 'text-teal-400', border: 'border-teal-500/30', bgTag: 'bg-teal-900/40', title: 'Tình Huống / Bậc Thấp', desc: 'Lượt chọn khá thấp (10-20%), tỷ lệ thắng thường dưới 50%.' },
      { id: 'D', color: 'bg-gray-500', text: 'text-gray-300', border: 'border-gray-600', bgTag: 'bg-gray-800', title: 'Lựa chọn Hiếm', desc: 'Ít xuất hiện (PR 5-10%), phụ thuộc hoàn toàn vào chiến thuật đặc dị.' },
      { id: 'E', color: 'bg-gray-600', text: 'text-gray-400', border: 'border-gray-700', bgTag: 'bg-gray-800/80', title: 'Tình huống cực hiếm', desc: 'PR rất thấp (2.5-5%).' },
      { id: 'F', color: 'bg-gray-700', text: 'text-gray-500', border: 'border-gray-700', bgTag: 'bg-gray-900', title: 'Out Meta', desc: 'Gần như biến mất khỏi giải đấu (PR < 2.5%).' }
    ];

    return tierConfig.map(tier => {
      const heroesInTier = tiers[tier.id];
      if (!heroesInTier || heroesInTier.length === 0) return null;
      return (
        <div key={tier.id} className="flex flex-col md:flex-row border border-gray-800 rounded-lg overflow-hidden bg-gray-900/30">
          <div className={`${tier.color} text-white font-black text-3xl w-full md:w-24 flex items-center justify-center py-4 md:py-0 border-b md:border-b-0 md:border-r border-gray-800`}>{tier.id}</div>
          <div className="flex-1 p-4">
            <h4 className={`${tier.text} font-bold mb-1`}>{tier.title}</h4>
            <p className="text-xs text-gray-400 mb-3">{tier.desc}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {heroesInTier.map(h => (
                <span key={h.name} className={`${tier.bgTag} ${tier.text} px-3 py-1 rounded text-xs border ${tier.border} flex flex-col items-center`}>
                  <span className="font-bold text-sm mb-1">{h.name}</span>
                  <span className="text-[10px] opacity-80 whitespace-nowrap">WR: {h.wr}% | PR: {h.pr}% {h.br > 0 && `| BR: ${h.br}%`}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  const LobbyModal = () => {
    if (!showLobbyModal) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-blue-600/50 rounded-xl w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl"><div className="flex items-center gap-3"><Globe className="w-6 h-6 text-blue-400" /><h2 className="text-lg font-bold text-white uppercase">Phòng Chơi Online</h2></div><button onClick={() => setShowLobbyModal(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button></div>
          <div className="p-6 space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg text-center">
              <h3 className="text-sm font-bold text-gray-400 mb-2">TẠO PHÒNG MỚI (BẠN LÀ ĐỘI XANH)</h3>
              <button onClick={handleCreateRoom} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg w-full transition-colors">Tạo Phòng Ngay</button>
            </div>
            <div className="text-center text-xs text-gray-500 font-bold uppercase">— Hoặc —</div>
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-gray-400 mb-2 text-center">THAM GIA PHÒNG (BẠN LÀ ĐỘI ĐỎ)</h3>
              <div className="flex gap-2">
                <input type="text" value={joinRoomIdInput} onChange={e=>setJoinRoomIdInput(e.target.value)} placeholder="Nhập mã phòng..." className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white uppercase outline-none focus:border-red-500 text-center font-bold tracking-widest" />
                <button onClick={handleJoinRoom} disabled={!joinRoomIdInput} className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded transition-colors">Vào</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HistoryModal = () => {
    if (!showHistoryModal) return null;
    return (
       <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-emerald-600/50 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(5,150,105,0.2)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl"><div className="flex items-center gap-3"><History className="w-8 h-8 text-emerald-400" /><div><h2 className="text-xl font-bold text-white uppercase">Lịch Sử Các Ván Draft</h2></div></div><button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-white"><X className="w-8 h-8" /></button></div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
            {savedMatches.length === 0 ? (<div className="text-center text-gray-500 py-10">Chưa có trận đấu nào được lưu.</div>) : (
              savedMatches.map((match, idx) => (
                <div key={idx} className="border border-gray-700 bg-gray-800/30 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-2">{new Date(match.timestamp).toLocaleString()}</div>
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex-1"><div className="text-blue-400 font-bold mb-1 flex justify-between"><span>ĐỘI XANH</span> <span>{match.prediction?.blue?.winRate || 0}%</span></div><div className="flex gap-1">{match.blueTeam.map(id => { const h = HERO_DB.find(x=>x.id === id); return <img key={id} src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><rect width='30' height='30' fill='%231f2937'/><text x='15' y='20' font-size='14' text-anchor='middle' fill='white'>${h?h.name.charAt(0):'?'}</text></svg>`} alt="Hero" className="w-8 h-8 rounded border border-blue-500/50"/> })}</div></div>
                    <div className="text-gray-600 font-black text-xl italic">VS</div>
                    <div className="flex-1 text-right"><div className="text-red-400 font-bold mb-1 flex justify-between"><span>{match.prediction?.red?.winRate || 0}%</span> <span>ĐỘI ĐỎ</span></div><div className="flex gap-1 justify-end">{match.redTeam.map(id => { const h = HERO_DB.find(x=>x.id === id); return <img key={id} src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><rect width='30' height='30' fill='%231f2937'/><text x='15' y='20' font-size='14' text-anchor='middle' fill='white'>${h?h.name.charAt(0):'?'}</text></svg>`} alt="Hero" className="w-8 h-8 rounded border border-red-500/50"/> })}</div></div>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 bg-black/30 p-2 rounded line-clamp-2">💬 AI: {match.prediction?.analysis}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const AiCoachModal = () => {
    if (!aiModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-purple-600/50 rounded-xl w-full max-w-3xl h-[600px] max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(147,51,234,0.3)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl"><div className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-purple-400" /><h2 className="text-xl font-bold text-white uppercase">Trợ lý AI HLV</h2></div><button onClick={() => setAiModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button></div>
          <div className="flex bg-gray-900/30 p-2 gap-2 border-b border-gray-800 overflow-x-auto">
            <button onClick={() => fetchAiAdvice('GENERAL')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${aiTab === 'GENERAL' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><BrainCircuit className="w-4 h-4" /> Tổng quan</button>
            <button onClick={() => fetchAiAdvice('COMBO')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${aiTab === 'COMBO' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><Zap className="w-4 h-4" /> Gợi ý Combo</button>
            <button onClick={() => fetchAiAdvice('COUNTER')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${aiTab === 'COUNTER' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><Swords className="w-4 h-4" /> Khắc chế Pick</button>
            <button onClick={() => fetchAiAdvice('BAN')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${aiTab === 'BAN' ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}><ShieldX className="w-4 h-4" /> Gợi ý Ban</button>
            <button onClick={() => setAiTab('CHAT')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${aiTab === 'CHAT' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(5,150,105,0.5)]' : 'text-gray-400 hover:bg-gray-800'}`}><MessageCircle className="w-4 h-4" /> Chat Cố vấn</button>
          </div>
          <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900/50 to-transparent overflow-hidden">
            {aiTab !== 'CHAT' ? (
              <div className="p-6 overflow-y-auto custom-scrollbar h-full">
                {aiLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-purple-400 gap-4 py-12 h-full"><Loader2 className="w-12 h-12 animate-spin" /><p className="animate-pulse font-semibold">Gemini AI đang phân tích...</p></div>
                ) : (
                  <div>
                    <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap">{aiResult.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className={`${aiTab === 'BAN' ? 'text-red-400' : aiTab === 'COUNTER' ? 'text-yellow-400' : aiTab === 'COMBO' ? 'text-blue-400' : 'text-purple-400'}`}>{text}</strong> : text)}</div>
                    {aiResult && <AiFeedbackWidget contextPrompt={currentPromptForFeedback} aiResponse={aiResult} user={user} db={db} appId={appId} aiTab={aiTab} />}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                  {chatHistory.length === 0 && !aiLoading && (<div className="text-center text-gray-500 mt-10"><MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" /><p>Hãy hỏi HLV bất kỳ điều gì về ván đấu này!</p></div>)}
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>{msg.role === 'model' ? <span className="whitespace-pre-wrap leading-relaxed">{msg.text.split('**').map((t, i) => i % 2 === 1 ? <strong key={i} className="text-emerald-400">{t}</strong> : t)}</span> : msg.text}</div>
                      {msg.role === 'model' && <div className="mt-1 max-w-[80%]"><AiFeedbackWidget contextPrompt={msg.text} aiResponse={msg.text} messageId={msg.id} user={user} db={db} appId={appId} aiTab={aiTab} /></div>}
                    </div>
                  ))}
                  {aiLoading && (<div className="flex justify-start"><div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Đang phản hồi...</div></div>)}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-gray-800 bg-gray-900/80 flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Nhập câu hỏi chiến thuật..." className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500" />
                  <button onClick={handleSendChat} disabled={aiLoading || !chatInput.trim()} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 px-4 rounded-lg disabled:opacity-50"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PredictionModal = () => {
    if (!showPredictionModal) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-fuchsia-600/50 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_80px_rgba(192,38,211,0.3)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl"><div className="flex items-center gap-3"><PieChart className="w-8 h-8 text-fuchsia-400" /><div><h2 className="text-xl font-bold text-white tracking-widest uppercase">✨ Dự Đoán Tỉ Lệ Thắng</h2></div></div><button onClick={() => setShowPredictionModal(false)} className="text-gray-400 hover:text-white"><X className="w-8 h-8" /></button></div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isPredicting ? (
              <div className="flex flex-col items-center justify-center py-20 text-fuchsia-400 gap-6"><Activity className="w-16 h-16 animate-pulse" /><p className="text-lg font-bold animate-pulse">Đang mô phỏng giao tranh tổng và Lưu lịch sử...</p></div>
            ) : predictionData ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 bg-gray-900/40 border border-blue-900/50 rounded-xl p-5"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-black text-blue-500 uppercase">Đội Xanh</h3><p className="text-sm text-gray-400 italic mt-1">{predictionData.blue?.playstyle}</p></div><div className="text-right"><span className="text-4xl font-black text-white">{predictionData.blue?.winRate}%</span></div></div><div className="mt-6 border-t border-gray-800 pt-4"><ScoreBar label="Đầu Game" value={predictionData.blue?.early} colorClass="bg-blue-500" /><ScoreBar label="Giữa Game" value={predictionData.blue?.mid} colorClass="bg-blue-500" /><ScoreBar label="Cuối Game" value={predictionData.blue?.late} colorClass="bg-blue-500" /><ScoreBar label="Giao tranh" value={predictionData.blue?.combat} colorClass="bg-blue-500" /></div></div>
                  <div className="flex-1 bg-gray-900/40 border border-red-900/50 rounded-xl p-5"><div className="flex justify-between items-start mb-4"><div><h3 className="text-2xl font-black text-red-500 uppercase">Đội Đỏ</h3><p className="text-sm text-gray-400 italic mt-1">{predictionData.red?.playstyle}</p></div><div className="text-right"><span className="text-4xl font-black text-white">{predictionData.red?.winRate}%</span></div></div><div className="mt-6 border-t border-gray-800 pt-4"><ScoreBar label="Đầu Game" value={predictionData.red?.early} colorClass="bg-red-500" /><ScoreBar label="Giữa Game" value={predictionData.red?.mid} colorClass="bg-red-500" /><ScoreBar label="Cuối Game" value={predictionData.red?.late} colorClass="bg-red-500" /><ScoreBar label="Giao tranh" value={predictionData.red?.combat} colorClass="bg-red-500" /></div></div>
                </div>
                <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 rounded-xl p-5"><h4 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5"/> Nhận định từ chuyên gia AI</h4><p className="text-gray-200 leading-relaxed">{predictionData.analysis}</p></div>
              </div>
            ) : (<div className="text-center text-red-400 py-10">Lỗi phân tích dữ liệu. Xin thử lại.</div>)}
          </div>
        </div>
      </div>
    );
  };

  const TierListModal = () => {
    if (!showTierList) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-yellow-600/50 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(202,138,4,0.2)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Tier List Mùa Xuân 2026</h2>
                <p className="text-xs text-gray-400 mt-1">Dữ liệu chuẩn xác dựa trên Tỉ lệ thắng (WR), Chọn (PR), Cấm (BR) thực tế</p>
              </div>
            </div>
            <button onClick={() => setShowTierList(false)} className="text-gray-400 hover:text-white"><X className="w-8 h-8" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-4">
              {renderTierList()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TacticalGuideModal = () => {
    if (!showGuide) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-[#111115] border-2 border-blue-600/50 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 rounded-t-xl"><div className="flex items-center gap-3"><BrainCircuit className="w-8 h-8 text-blue-400" /><h2 className="text-2xl font-bold text-white uppercase">Cẩm Nang Khắc Chế & Phong Cách</h2></div><button onClick={() => setShowGuide(false)} className="text-gray-400 hover:text-white"><X className="w-8 h-8" /></button></div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-gray-300 text-sm md:text-base leading-relaxed">
            <section className="mb-8">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> Nguyên Lý Khắc Chế Theo Lối Chơi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(PLAYSTYLE_COUNTERS).map(style => (
                  <div key={style} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="text-yellow-400 font-bold mb-2 uppercase">{style}</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                      <li><strong className="text-red-400">Tướng khắc chế:</strong> {PLAYSTYLE_COUNTERS[style].counters}</li>
                      <li><strong className="text-blue-400">Trang bị:</strong> {PLAYSTYLE_COUNTERS[style].equip}</li>
                      <li><strong className="text-green-400">Chiến thuật:</strong> {PLAYSTYLE_COUNTERS[style].tactic}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const TeamPanel = ({ isBlue }) => {
    const teamColor = isBlue ? 'blue' : 'red';
    const teamBans = isBlue ? blueBans : redBans;
    const teamPicks = isBlue ? bluePicks : redPicks;
    const isMyTurn = !isFinished && currentStep.team === (isBlue ? 'BLUE' : 'RED');
    const isMyOnlineTeam = gameMode === 'ONLINE' && myTeam === (isBlue ? 'BLUE' : 'RED');
    
    return (
      <div className={`flex flex-col w-full md:w-[280px] lg:w-[320px] p-4 bg-[#0d0d12] relative transition-all duration-300 ${isBlue ? 'border-r-2 border-blue-900/50' : 'border-l-2 border-red-900/50'} ${isMyTurn ? `shadow-[inset_0_0_50px_rgba(${isBlue ? '59,130,246' : '239,68,68'},0.15)] z-10` : 'opacity-80'}`}>
        <div className="flex flex-col mb-4 border-b border-gray-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-black ${isBlue ? 'text-blue-500' : 'text-red-500'} uppercase tracking-wider flex items-center gap-2`}>Đội {isBlue ? 'Xanh' : 'Đỏ'} {!isBlue && gameMode==='PVE' && <Bot className="w-5 h-5 text-red-500"/>}</h2>
            {isMyTurn && <div className="animate-pulse w-3 h-3 rounded-full bg-white shadow-[0_0_10px_white]"></div>}
          </div>
          {gameMode === 'ONLINE' && isMyOnlineTeam && <span className="text-[10px] text-gray-400 mt-1">(BẠN LÀ ĐỘI NÀY)</span>}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((idx) => {
            const hero = teamPicks[idx];
            const isCurrentlyPicking = isMyTurn && currentStep.phase === 'PICK' && idx === teamPicks.length;
            const previewHero = isCurrentlyPicking && !aiPlaying ? selectedHero : null;
            return (
              <div key={`pick-${idx}`} className={`h-[72px] rounded-lg border-2 flex items-center overflow-hidden transition-all duration-300 ${hero ? `border-${teamColor}-700/50 bg-gray-800/80` : isCurrentlyPicking ? `border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-gray-800` : 'border-gray-800 border-dashed bg-gray-900/50'}`}>
                <div className={`w-[72px] h-full flex-shrink-0 flex items-center justify-center font-bold text-2xl border-r border-gray-700 ${hero ? ROLE_STYLES[hero.role] : previewHero ? ROLE_STYLES[previewHero.role] : 'bg-gray-800 text-gray-600'}`}>
                  {hero ? hero.name.charAt(0) : previewHero ? previewHero.name.charAt(0) : <User className="w-8 h-8 opacity-50" />}
                </div>
                <div className="px-3 flex-1 flex flex-col justify-center overflow-hidden">
                  {hero ? (<><span className="text-white font-bold text-lg leading-tight truncate block w-full">{hero.name}</span><span className={`text-xs uppercase text-${teamColor}-400 font-semibold`}>ĐÃ KHÓA</span></>) : isCurrentlyPicking ? (<><span className={`font-bold text-lg leading-tight truncate block w-full ${previewHero ? 'text-yellow-400' : 'text-gray-500'}`}>{aiPlaying ? 'AI đang nghĩ...' : (previewHero ? previewHero.name : 'Đang chọn...')}</span>{previewHero && <span className="text-xs text-gray-400 animate-pulse">Chờ khóa</span>}</>) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs font-bold tracking-widest mb-2 flex items-center gap-1"><Ban className="w-3 h-3"/> TƯỚNG BỊ CẤM</p>
          <div className="flex justify-between gap-1">
            {[0, 1, 2, 3].map((idx) => {
              const hero = teamBans[idx];
              const isCurrentlyBanning = isMyTurn && currentStep.phase === 'BAN' && idx === teamBans.length;
              const previewHero = isCurrentlyBanning && !aiPlaying ? selectedHero : null;
              return (
                <div key={`ban-${idx}`} className={`w-[52px] h-[52px] lg:w-[60px] lg:h-[60px] rounded border-2 flex items-center justify-center relative overflow-hidden transition-all ${hero ? 'border-red-900 bg-gray-800' : isCurrentlyBanning ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)] bg-gray-800' : 'border-gray-800 border-dashed bg-gray-900/50'}`}>
                  {hero ? (<><span className="text-xl font-bold text-gray-400">{hero.name.charAt(0)}</span><div className="absolute inset-0 bg-red-900/60 flex items-center justify-center"><Ban className="text-red-500 w-8 h-8 opacity-80 rotate-45" /></div></>) : previewHero ? (<><span className="text-xl font-bold text-yellow-500/50">{previewHero.name.charAt(0)}</span><Ban className="absolute text-yellow-500 w-6 h-6 opacity-80 rotate-45 animate-pulse" /></>) : (<Ban className="text-gray-700 w-5 h-5 opacity-30" />)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const filteredHeroes = filterRole === 'ALL' ? HERO_DB : HERO_DB.filter(h => h.role === filterRole);

  let turnText = "";
  if (isFinished) turnText = "ĐÃ CHUẨN BỊ XONG";
  else {
    if (gameMode === 'LOCAL') turnText = `ĐỘI ${currentStep.team === 'BLUE' ? 'XANH' : 'ĐỎ'}`;
    else if (gameMode === 'PVE') turnText = `ĐỘI ${currentStep.team === 'BLUE' ? 'XANH' : 'ĐỎ (AI)'}`;
    else {
      if (currentStep.team === myTeam) turnText = "LƯỢT CỦA BẠN";
      else turnText = `CHỜ ĐỘI ${currentStep.team === 'BLUE' ? 'XANH' : 'ĐỎ'}...`;
    }
  }

  const selectedHeroPlaystyle = selectedHero ? getHeroPlaystyleInfo(selectedHero.name, selectedHero.role) : null;

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col font-sans selection:bg-gray-700 overflow-hidden">
      {LobbyModal()}
      {HistoryModal()}
      {AiCoachModal()}
      {PredictionModal()}
      {TierListModal()}
      {TacticalGuideModal()}

      <header className={`py-3 px-6 flex flex-col xl:flex-row justify-between items-start xl:items-center border-b-2 transition-colors duration-500 gap-4 ${isFinished ? 'border-fuchsia-500 bg-fuchsia-900/20' : currentStep?.team === 'BLUE' ? 'border-blue-600 bg-blue-900/20' : 'border-red-600 bg-red-900/20'}`}>
        <div className="flex flex-col w-full xl:w-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-yellow-500 flex-shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-black tracking-widest text-gray-100">ARENA OF VALOR</h1><span className="text-[10px] bg-red-600 px-2 py-0.5 rounded text-white font-bold hidden md:inline-block">5v5 ESPORTS</span></div>
              <div className="flex flex-wrap items-center mt-2 bg-gray-800 rounded-lg p-1 w-max border border-gray-700 gap-1">
                <button onClick={() => { if(!isFinished && gameMode !== 'ONLINE') setGameMode('LOCAL') }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${gameMode === 'LOCAL' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}><UserRound className="w-3.5 h-3.5"/> Cùng Máy</button>
                <button onClick={() => { if(!isFinished && gameMode !== 'ONLINE') setGameMode('PVE') }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${gameMode === 'PVE' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}><Bot className="w-3.5 h-3.5"/> Đấu AI</button>
                <div className="w-px h-4 bg-gray-600 mx-1"></div>
                <button onClick={() => { if(!isFinished) setShowLobbyModal(true) }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${gameMode === 'ONLINE' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-500 hover:bg-emerald-900/30 border border-emerald-900/50'}`}><Globe className="w-3.5 h-3.5"/> {gameMode === 'ONLINE' ? 'Đang Online' : 'Online'}</button>
              </div>
            </div>
          </div>
          {gameMode === 'ONLINE' && roomId && (
             <div className="mt-3 flex items-center gap-3 text-sm bg-gray-900/50 p-2 rounded-lg border border-gray-700 w-max">
                <span className="text-gray-400">Mã phòng:</span>
                <span className="font-black text-emerald-400 tracking-widest">{roomId}</span>
                <button onClick={() => navigator.clipboard.writeText(roomId)} className="text-gray-500 hover:text-white"><Copy className="w-4 h-4"/></button>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${roomStatus === 'WAITING' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'}`}>{roomStatus === 'WAITING' ? 'Chờ đối thủ...' : 'Đang đấu'}</span>
             </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 xl:ml-auto mb-3 xl:mb-0 order-first xl:order-none w-full xl:w-auto justify-end border-b xl:border-b-0 border-gray-800 pb-3 xl:pb-0">
          <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-1.5 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded border border-emerald-500/50 transition-all font-bold"><History className="w-3.5 h-3.5" /> Lịch sử Đấu</button>
          <button onClick={handleOpenAiCoach} className="flex items-center gap-1.5 text-xs bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white px-3 py-1.5 rounded border border-purple-500/50 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)] font-bold"><Sparkles className="w-3.5 h-3.5" /> AI Cố Vấn</button>
        </div>

        <div className="text-left xl:text-right w-full xl:w-auto xl:pl-4">
          {!isFinished ? (
            <><h2 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center xl:justify-end gap-2"><span className={`animate-pulse ${currentStep.team === 'BLUE' ? 'text-blue-400' : 'text-red-400'}`}>{turnText}</span></h2><p className="text-sm font-bold mt-1 xl:text-right">GIAI ĐOẠN: {currentStep.phase === 'BAN' ? <span className="text-red-400 bg-red-900/30 px-2 py-0.5 rounded">CẤM TƯỚNG (BAN)</span> : <span className="text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded">CHỌN TƯỚNG (PICK)</span>}</p></>
          ) : (<h2 className="text-2xl font-black uppercase text-fuchsia-400 tracking-widest text-center xl:text-right">{turnText}</h2>)}
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {TeamPanel({ isBlue: true })}

        <div className="flex-1 flex flex-col bg-[#111115] relative overflow-hidden">
          {aiPlayReason && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-900/95 border border-red-500 text-white p-3 rounded-lg text-sm shadow-[0_0_20px_rgba(220,38,38,0.5)] flex flex-col gap-2 w-full max-w-[95%] md:max-w-xl transition-all duration-300">
              <div className="flex items-start gap-2">
                <Bot className="w-5 h-5 flex-shrink-0 text-red-400"/> 
                <span className="flex-1 leading-relaxed">{aiPlayReason}</span>
                <button onClick={() => { setAiPlayReason(""); setShowAiTrainInput(false); }} className="text-gray-300 hover:text-white bg-red-950/50 p-1 rounded-full flex-shrink-0"><X className="w-4 h-4" /></button>
              </div>
              {!showAiTrainInput ? (
                <button onClick={() => setShowAiTrainInput(true)} className="self-end mt-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2 py-1 rounded flex items-center gap-1 transition-colors"><GraduationCap className="w-3 h-3"/> Dạy AI (Gửi lên Server Public)</button>
              ) : (
                <div className="flex gap-2 mt-2 pt-2 border-t border-red-500/50">
                  <input type="text" value={aiTrainText} onChange={e=>setAiTrainText(e.target.value)} placeholder="Dạy AI mẹo cấm chọn..." className="flex-1 bg-black/40 border border-red-400/50 rounded px-2 py-1 text-xs text-white outline-none focus:border-red-300" />
                  <button onClick={handleSaveAiRule} className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold transition-colors">Dạy</button>
                </div>
              )}
            </div>
          )}
          {aiPlaying && (<div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-red-400"><Loader2 className="w-12 h-12 animate-spin mb-4" /><h2 className="text-xl font-bold uppercase tracking-widest">Đội Đỏ (AI) đang phân tích Meta...</h2></div>)}
          
          {gameMode === 'ONLINE' && roomStatus === 'WAITING' && (
            <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center text-emerald-400"><Globe className="w-16 h-16 animate-pulse mb-4 text-blue-500" /><h2 className="text-2xl font-black uppercase tracking-widest mb-2">Đang tìm đối thủ...</h2><p className="text-gray-400 text-sm">Gửi mã <strong className="text-white text-lg tracking-widest">{roomId}</strong> cho bạn bè để họ nhập vào!</p></div>
          )}

          {/* HỒ SƠ TƯỚNG NÂNG CẤP VỚI CÁCH KHẮC CHẾ THEO LỐI CHƠI */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/40 flex flex-col lg:flex-row gap-4 items-start justify-between min-h-[160px] xl:min-h-[180px]">
            {selectedHero && selectedHeroPlaystyle ? (
              <div className="flex-1 flex gap-4 w-full">
                <div className={`w-28 h-28 lg:w-32 lg:h-32 rounded-lg flex items-center justify-center flex-shrink-0 border-2 shadow-lg ${ROLE_STYLES[selectedHero.role]} border-yellow-400 shadow-yellow-500/20`}>
                  <span className="text-5xl font-black">{selectedHero.name.charAt(0)}</span>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[140px] custom-scrollbar text-sm pr-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2"><Info className="w-4 h-4"/> {selectedHero.name}</h3>
                    <span className="bg-gray-800 border border-gray-600 px-2 py-0.5 rounded text-xs font-bold text-gray-300">
                      Phong cách: <span className="text-emerald-400">{selectedHeroPlaystyle.styles}</span>
                    </span>
                  </div>
                  
                  <div className="bg-black/30 p-2 rounded border border-gray-800">
                    <p className="text-red-400 font-bold mb-1 flex items-center gap-1"><Crosshair className="w-3.5 h-3.5"/> Mẹo khắc chế phong cách này:</p>
                    <ul className="list-disc list-inside text-gray-300 text-xs space-y-1">
                      {selectedHeroPlaystyle.counterRule ? (
                        <>
                          <li><span className="text-gray-400">Tướng:</span> {selectedHeroPlaystyle.counterRule.counters}</li>
                          <li><span className="text-gray-400">Trang bị:</span> {selectedHeroPlaystyle.counterRule.equip}</li>
                          <li><span className="text-gray-400">Chiến thuật:</span> {selectedHeroPlaystyle.counterRule.tactic}</li>
                        </>
                      ) : (
                        <li>Dồn sát thương hạ gục nhanh chóng hoặc tránh giao tranh trực diện.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (<div className="flex-1 flex items-center justify-center text-gray-500 h-[100px] border-2 border-dashed border-gray-700 rounded-lg text-center px-4">{gameMode === 'PVE' ? "Chế độ Đấu AI. Hãy chọn tướng của bạn." : gameMode === 'ONLINE' ? "Chế độ PvP Online. Hãy cẩn thận từng lượt chọn." : "Hãy chọn tướng để xem Mẹo Khắc Chế."}</div>)}
            
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-end mt-4 lg:mt-0 xl:ml-4 self-center gap-2">
              {!isFinished ? (
                <>
                  {gameMode !== 'ONLINE' && turnIndex > 0 && (
                    <button onClick={handleUndo} title="Đi lại (Undo)" disabled={aiPlaying} className={`flex items-center justify-center px-4 py-4 rounded transition-all flex-shrink-0 ${aiPlaying ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 hover:bg-gray-600 text-white shadow-[0_0_15px_rgba(75,85,99,0.4)]'}`}>
                      <Undo className="w-6 h-6" />
                    </button>
                  )}
                  <button onClick={handleManualLockIn} disabled={!selectedHero || aiPlaying || (gameMode==='PVE' && currentStep?.team === 'RED') || (gameMode==='ONLINE' && currentStep?.team !== myTeam)} className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded text-lg font-black uppercase transition-all ${selectedHero && !aiPlaying && !(gameMode==='PVE' && currentStep?.team === 'RED') && !(gameMode==='ONLINE' && currentStep?.team !== myTeam) ? currentStep.team === 'BLUE' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}><Check className="w-6 h-6" /> {(gameMode==='PVE' && currentStep?.team === 'RED') || (gameMode==='ONLINE' && currentStep?.team !== myTeam) ? 'CHỜ ĐỐI THỦ' : 'KHÓA LỰA CHỌN'}</button>
                </>
              ) : (
                <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
                   <button onClick={handlePredictAndSave} className="flex items-center justify-center gap-2 px-6 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 rounded text-white font-black uppercase transition-all shadow-[0_0_20px_rgba(192,38,211,0.4)] w-full lg:w-auto"><TrendingUp className="w-6 h-6" /> Dự Đoán Tỉ Lệ Thắng</button>
                  <button onClick={gameMode==='ONLINE' ? ()=>window.location.reload() : handleResetLocal} className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 hover:bg-yellow-500 rounded text-white font-black uppercase transition-all shadow-[0_0_20px_rgba(202,138,4,0.4)] w-full lg:w-auto"><RefreshCw className="w-6 h-6" /> {gameMode==='ONLINE'?'Thoát Phòng':'Chơi Lại'}</button>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-2 border-b border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                {['ALL', 'warrior', 'assassin', 'mage', 'marksman', 'support', 'tank'].map(role => (<button key={role} onClick={() => setFilterRole(role)} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full whitespace-nowrap transition-colors ${filterRole === role ? 'bg-gray-200 text-gray-900 shadow-sm' : 'text-gray-400 bg-gray-800 hover:text-white hover:bg-gray-700'}`}>{role === 'ALL' ? 'Tất cả' : role === 'warrior' ? 'Đấu sĩ' : role === 'assassin' ? 'Sát thủ' : role === 'mage' ? 'Pháp sư' : role === 'marksman' ? 'Xạ thủ' : role === 'support' ? 'Trợ thủ' : 'Đỡ đòn'}</button>))}
              </div>
              <button onClick={() => setShowTierList(true)} className="hidden lg:flex items-center gap-1 text-xs text-yellow-500 hover:text-yellow-400 whitespace-nowrap px-2"><Trophy className="w-4 h-4"/> Bảng Xếp Hạng Meta 2026</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 pb-8">
              {filteredHeroes.map((hero) => {
                const isLocked = lockedHeroes.includes(hero.id); const isSelected = selectedHero?.id === hero.id; const isBanned = blueBans.some(h=>h.id === hero.id) || redBans.some(h=>h.id === hero.id);
                // Kiểm tra xem có phải Tier cao không để gắn tag nhỏ
                const heroMeta = META_STATS[hero.name] || (hero.id === 'joker' ? META_STATS['Stuart (Joker)'] : null);
                let cardClass = "relative rounded-md overflow-hidden cursor-pointer transition-all duration-200 border-2 ";
                if (isLocked) cardClass += "border-gray-800 opacity-30 grayscale cursor-not-allowed"; else if (isSelected) cardClass += "border-yellow-400 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.6)] z-10"; else cardClass += `hover:scale-110 hover:z-10 border-transparent hover:border-gray-500 bg-gray-800`;
                
                return (
                  <div key={hero.id} className={cardClass} onClick={() => { if (!isLocked && !isFinished && !(gameMode==='PVE' && currentStep?.team === 'RED') && !(gameMode==='ONLINE' && currentStep?.team !== myTeam)) setSelectedHero(hero); }}>
                    <div className={`aspect-square flex items-center justify-center ${ROLE_STYLES[hero.role]} ${isLocked ? 'bg-gray-900' : ''}`}>
                      <span className="text-3xl font-black opacity-60">{hero.name.charAt(0)}</span>
                    </div>
                    {/* Tag Tier S, A+, A */}
                    {heroMeta && ['S', 'A+', 'A'].includes(heroMeta.tier) && !isLocked && (
                      <div className={`absolute top-0 right-0 text-[9px] font-black px-1.5 py-0.5 rounded-bl ${heroMeta.tier === 'S' ? 'bg-red-600 text-white' : heroMeta.tier === 'A+' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {heroMeta.tier}
                      </div>
                    )}
                    <div className="absolute bottom-0 w-full bg-black/90 text-center py-1 px-1 backdrop-blur-sm border-t border-white/10"><p className="text-[10px] md:text-xs font-bold text-gray-100 truncate">{hero.name}</p></div>
                    {isLocked && (<div className="absolute inset-0 flex items-center justify-center bg-black/70">{isBanned ? <Ban className="text-red-500 w-10 h-10 opacity-90" /> : <Check className="text-yellow-500 w-10 h-10 opacity-90" />}</div>)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {TeamPanel({ isBlue: false })}
      </main>

      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #111115; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a855f7; }`}} />
    </div>
  );
}