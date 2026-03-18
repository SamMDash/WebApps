# Bahmni AI Integration

This module integrates an external AI clinical decision support system with the Bahmni EMR platform, without modifying the core OpenMRS codebase.

## Structure

```
bahmni-ai-integration/
│
├ backend
│   ├ clinicalDataService.js      # Collects patient context from OpenMRS REST APIs
│   ├ aiRequestService.js         # Sends data to AI microservice, handles audit
│
├ frontend
│   ├ module.js                   # AngularJS module definition
│   ├ ai-assistant.directive.js   # Floating button and panel directive
│   ├ ai-assistant.controller.js  # Controller for panel logic
│   ├ ai-advisor.service.js       # Service to call backend AI endpoint
│
└ ui
    ├ ai-assistant.html           # UI for the AI Assistant panel
```

## Backend
- Collects patient data from OpenMRS REST endpoints
- Sends structured data to the AI microservice
- Logs every AI request for audit and safety

## Frontend
- Adds a floating "AI Assistant" button to the consultation page
- Opens a panel with AI results and disclaimer
- Uses AngularJS best practices and is modular/removable

## Disclaimer
AI suggestions are for clinical decision support only. Final decisions remain with the physician.
