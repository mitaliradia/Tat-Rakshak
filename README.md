
# Tat-Rakshak – AI/ML-driven Coastal Threat Alert System

Tat-Rakshak is an AI/ML-powered coastal threat alert platform designed to protect blue carbon ecosystems (mangroves, seagrasses, salt marshes) and coastal communities. It integrates real-time data from satellites, and community reports, applying ML models to detect anomalies, forecast risks, and generate actionable alerts.

The system has two main portals:

👥 Community/User Portal – Simple interface for anonymous reporting of threats and viewing alerts.

🛡 Authority Portal – Advanced dashboard for authorities to monitor, validate, and manage threats as well as get alerts via notifications and mail.

## Problem Statement
Blue carbon ecosystems play a critical role in climate change mitigation by acting as natural carbon sinks. However, they are under threat due to:

🌊 Rising sea levels and storm surges causing erosion and flooding.

🚮 Illegal activities – dumping, shrimp farming, logging.

❌ Lack of awareness & prioritization compared to forests.

📉 Scattered and inaccessible coastal threat data.

🔴 Gap: There is no unified, intelligent platform that integrates real-time data, AI insights, and community participation for early warnings and conservation.
## Our Solution
Tat-Rakshak bridges this gap by combining AI, satellite imagery, pre-trained ML models, and crowdsourced reporting into a single platform.

✅ Detects anomalies (sea-level rise, pollution, algal blooms).

✅ Forecasts floods, cyclones, and erosion.

✅ Allows communities to report illegal dumping, pollution, and other threats.

✅ Provides actionable alerts via dashboards, notifications and mails.
## System Architecture
Data Layer → Satellite APIs (Google Earth Engine), historical datasets

AI/ML Layer → Anomaly detection, forecasting (models through GROQ API), data visualization (through Numpy, Pandas, Matplotlib, Seaborn), Real time heat map of the regions

Alert Layer → Alert Posts for exposed communities, dashboard and alert emails for NGOs, authorities, & policy makers

Dashboard Layer → React-based UI for communities & authorities
## Tech Stack

**Frontend:** React, Next.js, TailwindCSS, Python Libraries

**Backend:** Node, Express, MongoDB

![WhatsApp Image 2025-08-30 at 14 30 29_5d95e7f6](https://github.com/user-attachments/assets/8d042a54-775e-4419-96e2-4da1195bde83)

## Upto Mid Evaluation

The data ingestion part is succesfully running with analytical outputs added to the MongoDB.  
Even the backend which communicates with the frontend and the data ingestion part is ready.  

Now post the mid evalution round our main goal will be to merge all these Tech and integrate them together in order to create a working full stack prototype that act as an alert system for the costal areas.
