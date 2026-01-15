// ==UserScript==
// @name         Warzone/MW3 Ultimate Aimbot - Roboflow Edition
// @namespace    https://warzoneaimbot.com
// @version      5.0.0
// @description  Ultimate Warzone/MW3 Aimbot with Roboflow Detection, Advanced ESP, Rage Features
// @author       WarzoneAimbot
// @match        *://*.xbox.com/play/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              WARZONE/MW3 ULTIMATE AIMBOT v5.0.0                           ║
 * ║                    ROBOFLOW CUSTOM MODEL EDITION                          ║
 * ║                                                                           ║
 * ║   Features: Custom Roboflow Detection, Rage Aimbot, Smart ESP            ║
 * ║   Model: cod-mw-warzone-7vnnf-eodmc/4                                     ║
 * ║   Toggle UI: Alt + Ctrl                                                   ║
 * ║   For educational purposes only.                                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const WZ = {
        version: '5.0.0',
        brand: 'Warzone Aimbot',
        edition: 'Ultimate',
        game: 'Call of Duty: Warzone/MW3',
        
        // UI
        currentTab: 'dashboard',
        toggleKeys: { alt: true, ctrl: true },
        
        // Roboflow Detection - Custom Model
        detection: {
            enabled: true,
            apiUrl: 'https://detect.roboflow.com',
            
            // Model Selection
            currentModel: 'model_4', // model_4 or model_5
            models: {
                model_4: {
                    modelEndpoint: 'cod-mw-warzone-7vnnf-eodmc/4',
                    modelType: 'Roboflow 3.0 Fast',
                },
                model_5: {
                    modelEndpoint: 'cod-mw-warzone-7vnnf-eodmc/5',
                    modelType: 'RF-DETR (Nano)',
                }
            },
            
            apiKey: 'zgwjPRaBQNjZT1O1P98d',
            modelEndpoint: 'cod-mw-warzone-7vnnf-eodmc/4', // Legacy, will be dynamically set
            modelType: 'Roboflow 3.0 Fast', // Legacy, will be dynamically set
            confidence: 0.35,
            maxDetections: 20,
            targetClasses: ['enemy', 'player', 'operator', 'person'],
            headClasses: ['head', 'headshot'],
            
            // Detection Box Sizes (forced)
            // The following are the new, separate width and height properties.
            // The original code used a single size property, which is now deprecated but kept for compatibility.
            // The logic in detectWithRoboflow will be updated to prioritize these new properties.
            forceBoxSize: true,
            enemyBoxWidth: 512,
            enemyBoxHeight: 512,
            headBoxWidth: 64,
            headBoxHeight: 64,
        },
        
        // Self Filter
        selfFilter: {
            enabled: true,
            deadZone: { enabled: true, radius: 100 },
            bottomScreen: { enabled: true, threshold: 0.80 },
            sizeFilter: { enabled: true, minWidth: 30, maxWidth: 600, minHeight: 50, maxHeight: 700 },
            aspectRatio: { enabled: true, min: 0.3, max: 2.0 },
        },
        
        // Game Settings
        game: {
            videoSelector: 'video[aria-label="Game Stream for unknown title"]',
            containerSelector: '#game-stream',
            aimInterval: 1, // ~1000fps (Attempt to bypass stream cap and run as fast as possible)
            fovRadius: 200,
        },
        
        // AIMBOT SETTINGS
        aimbot: {
            enabled: true,
            // Aim Key
            aimKey: 'KeyQ', // Q key (Can be a keyboard code, 'Mouse0', 'Mouse1', or 'GamepadButton0', etc.)
            aimKeyEnabled: true,
            holdToAim: true,
            
            // Keybinds
            aimKeyDisplay: 'Q', // Display name for the key
            toggleKey: 'Alt+Ctrl', // Display name for the toggle key
            
            // Aim Bones
            aimBone: 'head', // head, neck, chest, center
            aimBones: {
                head: { offset: 0.08, name: 'Head', priority: 1 },
                neck: { offset: 0.15, name: 'Neck', priority: 2 },
                chest: { offset: 0.35, name: 'Chest', priority: 3 },
                center: { offset: 0.50, name: 'Center', priority: 4 },
            },
            
            // Strength & Speed
            strength: 100, // 0-100%
            instantLock: true,
            lockSpeed: 1.0, // 1.0 = instant
            
            // Smoothing
            smoothing: { enabled: false, factor: 0.9 },
            
            // Prediction
            prediction: { enabled: true, factor: 0.25 },
            
            // Target Priority
            targetPriority: 'closest', // closest, center, lowestHealth
            
            // Sticky Aim
            stickyAim: { enabled: true, radius: 60, strength: 0.8 },
            
            // Auto Shoot
            autoShoot: true,
            autoCrouchShoot: true,
        },
        
        // RAGE SETTINGS
        rage: {
            enabled: false,
            autoFire: false,
            triggerBot: false,
            triggerDelay: 30,
            noRecoil: true,
            recoilLevel: 4,
            recoilPatterns: {
                1: { vertical: 0, horizontal: 0, recoverySpeed: 0.5 },
                2: { vertical: 0.2, horizontal: 0.05, recoverySpeed: 0.2 },
                3: { vertical: 0.4, horizontal: 0.1, recoverySpeed: 0.15 },
                4: { vertical: 0.6, horizontal: 0.2, recoverySpeed: 0.1 },
            },
        },
        
        // ESP SETTINGS
        esp: {
            enabled: true,
            alwaysRender: true,
            
            // Visual
            rgbMode: false,
            rgbSpeed: 3,
            
            // Features
            boxes: { enabled: true, thickness: 2, filled: false, color: '#FF0000' },
            cornerStyle: false,
            snaplines: { enabled: true, thickness: 1, position: 'bottom', color: '#FF0000' },
            skeleton: { enabled: false, thickness: 1 },
            healthBar: { enabled: false, position: 'left' },
            distance: { enabled: true, color: '#FFFFFF' },
            names: { enabled: true, color: '#FFFFFF' },
            headDot: { enabled: true, size: 6, color: '#FF0000' },
            glow: { enabled: true, blur: 10 },
            
            // Only render where detections exist
            smartRender: true,
        },
        
        // Crosshair
        crosshair: {
            enabled: true,
            size: 15,
            thickness: 2,
            gap: 5,
            style: 'cross', // cross, dot, circle
            rgbMode: false,
            color: '#00FF00',
        },
        
        // FOV Circle
        fovCircle: {
            enabled: true,
            rgbMode: false,
            color: 'rgba(255, 0, 0, 0.3)',
            filled: false,
            thickness: 2,
        },
        
        // Performance
        performance: {
            frameSkip: 0,
            maxFPS: 144,
            lowLatency: true,
        },
        
        // Debug
        debug: {
            enabled: true,
            showStats: true,
            logMovement: false,
        }
    };

    // ============================================================
    // GLOBAL STATE
    // ============================================================
    let gameVideo = null;
    let detectionModel = null;
    let overlayCanvas = null;
    let overlayCtx = null;
    let guiContainer = null;
    let currentTarget = null;
    let bestTarget = null;
    let allDetections = [];
    let filteredDetections = [];
    let processingFrame = false;
    let frameCount = 0;
    let rgbHue = 0;
    let lastTargetPos = null;
    let isAiming = false;
    let detectionCanvas = null;
    let detectionCtx = null;
    let recoilOffset = { x: 0, y: 0 };
    
    const stats = {
        fps: 0,
        detections: 0,
        inferenceTime: 0,
        modelMs: 0,
        lastUpdate: Date.now(),
        frames: 0
    };

    // ============================================================
    // UTILITIES
    // ============================================================
    const utils = {
        clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
        distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
        lerp: (a, b, t) => a + (b - a) * t,
        
        updateFPS() {
            stats.frames++;
            const now = Date.now();
            if (now - stats.lastUpdate >= 1000) {
                stats.fps = stats.frames;
                stats.frames = 0;
                stats.lastUpdate = now;
            }
        },
        
        hslToRgb(h, s, l) {
            let r, g, b;
            if (s === 0) { r = g = b = l; }
            else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            return `rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`;
        },
        
        getRgbColor(offset = 0) {
            const h = ((rgbHue + offset) % 360) / 360;
            return utils.hslToRgb(h, 1, 0.5);
        },
        
        log(...args) {
            if (WZ.debug.enabled) {
                console.log('[WarzoneAimbot]', ...args);
            }
        },
        
        error(...args) {
            console.error('[WarzoneAimbot] ERROR:', ...args);
        }
    };

    // ============================================================
    // INPUT SYSTEM
    // ============================================================
    const Input = {
        mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        lastClientX: window.innerWidth / 2,
        lastClientY: window.innerHeight / 2,
        isMouseDown: false,
        isShooting: false,
        keys: {},
        
        init() {
            this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.lastClientX = window.innerWidth / 2;
            this.lastClientY = window.innerHeight / 2;
            
            // Set initial mouse position for the game stream to prevent immediate spin
            // This is a guess at the game's initial cursor position
            this._simulatePointerEvent({
                type: 'pointermove',
                clientX: this.lastClientX,
                clientY: this.lastClientY,
                movementX: 0,
                movementY: 0,
            });
            
            // Gamepad polling setup
            this.gamepadInterval = setInterval(this.pollGamepads.bind(this), 1000 / 60); // Poll at 60 FPS
            
            document.addEventListener('mousedown', e => {
                this.isMouseDown = true;
                const key = `Mouse${e.button}`;
                this.keys[key] = true;

                // Auto-shoot on aim key press (for mouse buttons)
                if (WZ.aimbot.autoShoot && key === WZ.aimbot.aimKey && !e.repeat) {
                    if (!this.isShooting) {
                        this.startShooting();
                    }
                }
            }, true);
            
            document.addEventListener('mouseup', e => {
                this.isMouseDown = false;
                const key = `Mouse${e.button}`;
                this.keys[key] = false;

                // Stop shooting on aim key release (for mouse buttons)
                if (WZ.aimbot.autoShoot && key === WZ.aimbot.aimKey) {
                    if (this.isShooting) {
                        this.stopShooting();
                    }
                }
            }, true);
            
            document.addEventListener('mousemove', e => {
                this.mousePos = { x: e.clientX, y: e.clientY };
            }, true);
            
            document.addEventListener('keydown', e => {
                this.keys[e.code] = true;
                
                // Auto-shoot on aim key press
                if (WZ.aimbot.autoShoot && e.code === WZ.aimbot.aimKey && !e.repeat) {
                    if (!this.isShooting) {
                        this.startShooting();
                    }
                }
            }, true);
            
            document.addEventListener('keyup', e => {
                this.keys[e.code] = false;
                
                // Stop shooting on aim key release
                if (WZ.aimbot.autoShoot && e.code === WZ.aimbot.aimKey) {
                    if (this.isShooting) {
                        this.stopShooting();
                    }
                }
            }, true);
            
            utils.log('Input system initialized');
        },

        pollGamepads() {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    // Handle buttons
                    gamepad.buttons.forEach((button, index) => {
                        const key = `GamepadButton${index}`;
                        const isPressed = button.pressed;
                        
                        // Check for state change
                        if (isPressed !== this.keys[key]) {
                            this.keys[key] = isPressed;
                            
                            // Auto-shoot logic for gamepad buttons
                            if (key === WZ.aimbot.aimKey) {
                                if (isPressed) {
                                    if (WZ.aimbot.autoShoot && !this.isShooting) {
                                        this.startShooting();
                                    }
                                } else {
                                    if (WZ.aimbot.autoShoot && this.isShooting) {
                                        this.stopShooting();
                                    }
                                }
                            }
                        }
                    });

                    // Handle axes (e.g., for movement or aiming)
                    gamepad.axes.forEach((value, index) => {
                        const key = `GamepadAxis${index}`;
                        // Store axis value directly
                        this.keys[key] = value;
                    });
                }
            }
        },

        isKeyDown(key) {
            // Check for button press (keyboard, mouse, gamepad button)
            if (typeof this.keys[key] === 'boolean') {
                return this.keys[key];
            }
            // Check for axis value (gamepad axis)
            if (typeof this.keys[key] === 'number') {
                // Treat axis as "down" if it's significantly off-center (e.g., for a trigger or stick direction)
                // This threshold (0.5) is arbitrary and might need tuning, but covers basic use cases.
                return Math.abs(this.keys[key]) > 0.5;
            }
            return false;
        },
        
        getAxisValue(axisKey) {
            return this.keys[axisKey] || 0;
        },

        moveMouseTo(targetX, targetY) {
            this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.lastClientX = window.innerWidth / 2;
            this.lastClientY = window.innerHeight / 2;
            
            document.addEventListener('mousedown', e => {
                this.isMouseDown = true;
                const key = `Mouse${e.button}`;
                this.keys[key] = true;

                // Auto-shoot on aim key press (for mouse buttons)
                if (WZ.aimbot.autoShoot && key === WZ.aimbot.aimKey && !e.repeat) {
                    if (!this.isShooting) {
                        this.startShooting();
                    }
                }
            }, true);
            
            document.addEventListener('mouseup', e => {
                this.isMouseDown = false;
                const key = `Mouse${e.button}`;
                this.keys[key] = false;

                // Stop shooting on aim key release (for mouse buttons)
                if (WZ.aimbot.autoShoot && key === WZ.aimbot.aimKey) {
                    if (this.isShooting) {
                        this.stopShooting();
                    }
                }
            }, true);
            
            document.addEventListener('mousemove', e => {
                this.mousePos = { x: e.clientX, y: e.clientY };
            }, true);
            
            document.addEventListener('keydown', e => {
                this.keys[e.code] = true;
                
                // Auto-shoot on aim key press
                if (WZ.aimbot.autoShoot && e.code === WZ.aimbot.aimKey && !e.repeat) {
                    if (!this.isShooting) {
                        this.startShooting();
                    }
                }
            }, true);
            
            document.addEventListener('keyup', e => {
                this.keys[e.code] = false;
                
                // Stop shooting on aim key release
                if (WZ.aimbot.autoShoot && e.code === WZ.aimbot.aimKey) {
                    if (this.isShooting) {
                        this.stopShooting();
                    }
                }
            }, true);
            
            utils.log('Input system initialized');
        },
        
        isKeyDown(key) {
            return this.keys[key] === true;
        },
        
        moveMouseTo(targetX, targetY) {
            // Calculate the required movement delta from the current mouse position (Input.mousePos)
            let deltaX = targetX - this.mousePos.x;
            let deltaY = targetY - this.mousePos.y;
            
            // Apply recoil compensation
            if (WZ.rage.noRecoil && WZ.rage.recoilPatterns[WZ.rage.recoilLevel]) {
                const recoilPattern = WZ.rage.recoilPatterns[WZ.rage.recoilLevel];
                const recoilMultiplier = 5;
                
                if (this.isShooting) {
                    const kickY = recoilPattern.vertical * recoilMultiplier;
                    const kickX = (Math.random() - 0.5) * 2 * (recoilPattern.horizontal * recoilMultiplier);
                    recoilOffset.x += kickX;
                    recoilOffset.y += kickY;
                    const recovery = recoilPattern.recoverySpeed;
                    recoilOffset.x *= (1 - recovery);
                    recoilOffset.y *= (1 - recovery);
                } else {
                    const recovery = recoilPattern.recoverySpeed * 3;
                    recoilOffset.x *= (1 - recovery);
                    recoilOffset.y *= (1 - recovery);
                }
                
                if (Math.abs(recoilOffset.x) < 0.05) recoilOffset.x = 0;
                if (Math.abs(recoilOffset.y) < 0.05) recoilOffset.y = 0;
                
                deltaX = deltaX - recoilOffset.x;
                deltaY = deltaY + recoilOffset.y;
            }
            
            // Apply smoothing if enabled
            if (WZ.aimbot.smoothing.enabled) {
                // Smoothing should be applied to the delta, not the final position
                deltaX *= (1 - WZ.aimbot.smoothing.factor);
                deltaY *= (1 - WZ.aimbot.smoothing.factor);
            }
            
            // Apply strength
            const strength = WZ.aimbot.strength / 100;
            deltaX *= strength;
            deltaY *= strength;
            
            const threshold = 0.1;
            if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
                const newClientX = this.lastClientX + deltaX;
                const newClientY = this.lastClientY + deltaY;
                
                if (WZ.debug.logMovement) {
                    utils.log(`Aim | Target(${targetX.toFixed(1)},${targetY.toFixed(1)}) | Delta(${deltaX.toFixed(1)},${deltaY.toFixed(1)})`);
                }
                
                // The simulated event should use the delta for movementX/Y
                this._simulatePointerEvent({
                    type: 'pointermove',
                    clientX: this.mousePos.x + deltaX, // Use current position + delta for new absolute position
                    clientY: this.mousePos.y + deltaY,
                    movementX: deltaX,
                    movementY: deltaY,
                });
                
                // The actual mouse position is updated by the 'mousemove' listener, 
                // but we update lastClientX/Y here for the recoil/smoothing logic to work correctly
                // in the next frame's calculation.
                this.lastClientX = this.mousePos.x + deltaX;
                this.lastClientY = this.mousePos.y + deltaY;
            }
        },
        
        startShooting() {
            if (this.isShooting) return;
            this.isShooting = true;
            this._simulatePointerEvent({
                type: 'pointerdown',
                clientX: this.lastClientX,
                clientY: this.lastClientY,
                button: 0,
                buttons: 1
            });
            utils.log('Started shooting');
        },
        
        stopShooting() {
            if (!this.isShooting) return;
            this.isShooting = false;
            this._simulatePointerEvent({
                type: 'pointerup',
                clientX: this.lastClientX,
                clientY: this.lastClientY,
                button: 0,
                buttons: 0
            });
            utils.log('Stopped shooting');
        },
        
        _simulatePointerEvent(options) {
            const { type, clientX, clientY, movementX = 0, movementY = 0, button = 0, buttons = 0 } = options;
            const event = new PointerEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: Math.round(clientX),
                clientY: Math.round(clientY),
                movementX: Math.round(movementX),
                movementY: Math.round(movementY),
                pointerType: 'mouse',
                button: button,
                buttons: buttons,
            });
            window.dispatchEvent(event);
        }
    };

    // ============================================================
    // ROBOFLOW DETECTION
    // ============================================================
    async function detectWithRoboflow(videoElement, maxDetections, confidence) {
        const startTime = performance.now();
        
        try {
            // Capture current video frame to canvas
            const originalWidth = videoElement.videoWidth;
            const originalHeight = videoElement.videoHeight;
            
            // Optimization: Resize image to a smaller resolution for faster inference (e.g., 640x480)
            // This is the most effective way to reduce model latency.
            const targetWidth = 640;
            const targetHeight = 480;
            
            detectionCanvas.width = targetWidth;
            detectionCanvas.height = targetHeight;
            
            // Draw the video frame onto the smaller canvas
            detectionCtx.drawImage(videoElement, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);
            
            // Convert canvas to base64
            const base64Image = detectionCanvas.toDataURL('image/jpeg', 0.8).split(',')[1];
            
            // Call Roboflow API
            // The user's tutorial suggests a different endpoint for the workflow:
            // https://detect.roboflow.com/kremcheats/detect-count-and-visualize-4
            // However, the original code uses the model endpoint from WZ.detection.modelEndpoint.
            // I will stick to the original structure but use the current model's endpoint.
            const currentModelEndpoint = WZ.detection.models[WZ.detection.currentModel].modelEndpoint;
            const apiUrl = `${WZ.detection.apiUrl}/${currentModelEndpoint}?api_key=${WZ.detection.apiKey}&confidence=${Math.round(confidence * 100)}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: base64Image
            });
            
            if (!response.ok) {
                throw new Error(`Roboflow API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update model MS
            stats.modelMs = Math.round(performance.now() - startTime);
            
            // Convert Roboflow format to our format with forced box sizes
            const predictions = (data.predictions || [])
                .filter(pred => {
                    const matchesClass = WZ.detection.targetClasses.some(cls => 
                        pred.class.toLowerCase() === cls.toLowerCase()
                    );
                    
                    // Aimbot logic fix: Roboflow returns center coordinates, so we must use them directly
                    // The original code was incorrectly calculating the top-left corner from the center.
                    // The prediction object already contains x, y, width, height.
                    // The aimbot logic should use the center (pred.x, pred.y) for aiming.
                    // The bounding box for ESP should be calculated as (x - w/2, y - h/2, w, h).
                    
                    return matchesClass && pred.confidence >= confidence;
                })
                .slice(0, maxDetections)
                .map(pred => {
                    const isHead = WZ.detection.headClasses.some(cls => 
                        pred.class.toLowerCase() === cls.toLowerCase()
                    );
                    
                    // Scale coordinates and dimensions back to original video resolution
                    const scaleX = originalWidth / targetWidth;
                    const scaleY = originalHeight / targetHeight;
                    
                    pred.x *= scaleX;
                    pred.y *= scaleY;
                    pred.width *= scaleX;
                    pred.height *= scaleY;
                    
                    let width = pred.width;
                    let height = pred.height;
                    
                    // Force box sizes if enabled
                    if (WZ.detection.forceBoxSize) {
                        if (isHead) {
                            // Use the new separate width/height properties
                            width = WZ.detection.headBoxWidth || WZ.detection.headBoxSize;
                            height = WZ.detection.headBoxHeight || WZ.detection.headBoxSize;
                        } else {
                            // Use the new separate width/height properties
                            width = WZ.detection.enemyBoxWidth || WZ.detection.enemyBoxSize;
                            height = WZ.detection.enemyBoxHeight || WZ.detection.enemyBoxSize;
                        }
                    }
                    
                    // The bounding box for ESP is top-left corner (x, y) and dimensions (width, height)
                    // Roboflow returns center coordinates, so we convert to top-left for the bounding box.
                    const bboxX = pred.x - width / 2;
                    const bboxY = pred.y - height / 2;
                    
                    return {
                        // Bounding box for ESP (top-left corner)
                        bbox: [
                            bboxX,
                            bboxY,
                            width,
                            height
                        ],
                        // Center coordinates for Aimbot (as returned by Roboflow)
                        center: [
                            pred.x,
                            pred.y
                        ],
                        class: pred.class,
                        score: pred.confidence,
                        isHead: isHead
                    };
                });
            
            return predictions;
        } catch (error) {
            utils.error('Roboflow detection error:', error);
            stats.modelMs = Math.round(performance.now() - startTime);
            return [];
        }
    }

    // ============================================================
    // SELF FILTER
    // ============================================================
    function applySelfFilter(detections) {
        if (!WZ.selfFilter.enabled) return detections;
        
        const videoRect = gameVideo.getBoundingClientRect();
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        
        return detections.filter(det => {
            const [x, y, w, h] = det.bbox;
            const [centerX, centerY] = det.center; // Use the center coordinates from the detection object
            
            // Convert to screen coordinates
            const screenX = videoRect.left + (centerX / gameVideo.videoWidth) * videoRect.width;
            const screenY = videoRect.top + (centerY / gameVideo.videoHeight) * videoRect.height;
            
            // Dead zone filter
            if (WZ.selfFilter.deadZone.enabled) {
                const distToCenter = utils.distance(screenX, screenY, screenCenterX, screenCenterY);
                if (distToCenter < WZ.selfFilter.deadZone.radius) {
                    return false;
                }
            }
            
            // Bottom screen filter
            if (WZ.selfFilter.bottomScreen.enabled) {
                const relativeY = screenY / window.innerHeight;
                if (relativeY > WZ.selfFilter.bottomScreen.threshold) {
                    return false;
                }
            }
            
            // Size filter
            if (WZ.selfFilter.sizeFilter.enabled) {
                // Use the scaled width and height (w, h) from the detection object
                if (w < WZ.selfFilter.sizeFilter.minWidth || w > WZ.selfFilter.sizeFilter.maxWidth) return false;
                if (h < WZ.selfFilter.sizeFilter.minHeight || h > WZ.selfFilter.sizeFilter.maxHeight) return false;
            }
            
            // Aspect ratio filter
            if (WZ.selfFilter.aspectRatio.enabled) {
                const aspectRatio = w / h;
                if (aspectRatio < WZ.selfFilter.aspectRatio.min || aspectRatio > WZ.selfFilter.aspectRatio.max) {
                    return false;
                }
            }
            
            return true;
        });
    }

    // ============================================================
    // TARGET SELECTION
    // ============================================================
    function selectBestTarget(detections) {
        if (!detections || detections.length === 0) return null;
        
        const videoRect = gameVideo.getBoundingClientRect();
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        
        const videoAspectRatio = gameVideo.videoWidth / gameVideo.videoHeight;
        const displayAspectRatio = videoRect.width / videoRect.height;
        let videoDisplayWidth = videoRect.width;
        let videoDisplayHeight = videoRect.height;
        let videoDisplayLeft = videoRect.left;
        let videoDisplayTop = videoRect.top;
        
        if (videoAspectRatio > displayAspectRatio) {
            videoDisplayHeight = videoRect.width / videoAspectRatio;
            videoDisplayTop = videoRect.top + (videoRect.height - videoDisplayHeight) / 2;
        } else {
            videoDisplayWidth = videoRect.height * videoAspectRatio;
            videoDisplayLeft = videoRect.left + (videoRect.width - videoDisplayWidth) / 2;
        }
        
        let bestScore = Infinity;
        let bestTarget = null;
        
        detections.forEach(det => {
            const [x, y, w, h] = det.bbox;
            const [centerX, centerY] = det.center; // Use the center coordinates from the detection object
            
            const screenX = videoDisplayLeft + (centerX / gameVideo.videoWidth) * videoDisplayWidth;
            const screenY = videoDisplayTop + (centerY / gameVideo.videoHeight) * videoDisplayHeight;
            
            // Check FOV
            const distToCenter = utils.distance(screenX, screenY, screenCenterX, screenCenterY);
            if (distToCenter > WZ.game.fovRadius) return;
            
            // Calculate priority score
            let score;
            if (WZ.aimbot.targetPriority === 'closest') {
                score = utils.distance(screenX, screenY, Input.mousePos.x, Input.mousePos.y);
            } else if (WZ.aimbot.targetPriority === 'center') {
                score = distToCenter;
            } else {
                score = distToCenter;
            }
            
            // Prefer head targets
            if (det.isHead) {
                score *= 0.5; // Higher priority for heads
            }
            
            if (score < bestScore) {
                bestScore = score;
                bestTarget = {
                    detection: det,
                    screenX: screenX,
                    screenY: screenY,
                    videoDisplayLeft: videoDisplayLeft,
                    videoDisplayTop: videoDisplayTop,
                    videoDisplayWidth: videoDisplayWidth,
                    videoDisplayHeight: videoDisplayHeight
                };
            }
        });
        
        return bestTarget;
    }

    // ============================================================
    // AIMBOT LOGIC
    // ============================================================
    function processAimbot(target) {
        if (!target || !WZ.aimbot.enabled) {
            if (Input.isShooting && WZ.aimbot.autoShoot) {
                Input.stopShooting();
            }
            return;
        }
        
        // Check if aim key is held (if enabled)
        if (WZ.aimbot.aimKeyEnabled && WZ.aimbot.holdToAim) {
            if (!Input.isKeyDown(WZ.aimbot.aimKey)) {
                if (Input.isShooting && WZ.aimbot.autoShoot) {
                    Input.stopShooting();
                }
                return;
            }
        }
        
        const det = target.detection;
        const [x, y, w, h] = det.bbox;
        
        // Calculate aim point based on bone selection
        // target.screenX and target.screenY are the screen coordinates of the detection's center.
        let aimX = target.screenX;
        let aimY = target.screenY;
        
        if (WZ.aimbot.aimBone && WZ.aimbot.aimBones[WZ.aimbot.aimBone]) {
            const bone = WZ.aimbot.aimBones[WZ.aimbot.aimBone];
            
            // Calculate the screen Y coordinate of the top of the bounding box
            const bboxY_screen = target.videoDisplayTop + (y / gameVideo.videoHeight) * target.videoDisplayHeight;
            // Calculate the screen height of the bounding box
            const bboxH_screen = (h / gameVideo.videoHeight) * target.videoDisplayHeight;
            
            // Calculate the new aim Y based on the bone offset from the top of the box
            aimY = bboxY_screen + bboxH_screen * bone.offset;
        }
        
        // Apply prediction if enabled
        if (WZ.aimbot.prediction.enabled && lastTargetPos) {
            const deltaX = aimX - lastTargetPos.x;
            const deltaY = aimY - lastTargetPos.y;
            aimX += deltaX * WZ.aimbot.prediction.factor;
            aimY += deltaY * WZ.aimbot.prediction.factor;
        }
        
        lastTargetPos = { x: aimX, y: aimY };
        
        // Apply sticky aim if enabled
        if (WZ.aimbot.stickyAim.enabled && currentTarget) {
            const distToCurrent = utils.distance(aimX, aimY, Input.mousePos.x, Input.mousePos.y);
            if (distToCurrent < WZ.aimbot.stickyAim.radius) {
                const stickyStrength = WZ.aimbot.stickyAim.strength;
                aimX = utils.lerp(Input.mousePos.x, aimX, stickyStrength);
                aimY = utils.lerp(Input.mousePos.y, aimY, stickyStrength);
            }
        }
        
        // Move mouse to target
        let finalTargetX, finalTargetY;
        
        if (WZ.aimbot.instantLock) {
            finalTargetX = aimX;
            finalTargetY = aimY;
        } else {
            const lerpFactor = WZ.aimbot.lockSpeed;
            // Use the current mouse position (which is updated by mousemove events)
            finalTargetX = utils.lerp(Input.mousePos.x, aimX, lerpFactor);
            finalTargetY = utils.lerp(Input.mousePos.y, aimY, lerpFactor);
        }
        
        Input.moveMouseTo(finalTargetX, finalTargetY);
        
        currentTarget = target;
    }

    // ============================================================
    // ESP RENDERING
    // ============================================================
    function drawESP() {
        if (!overlayCanvas || !overlayCtx || !WZ.esp.enabled) return;
        
        overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        
        // Draw FOV circle
        if (WZ.fovCircle.enabled) {
            overlayCtx.strokeStyle = WZ.esp.rgbMode ? utils.getRgbColor() : WZ.fovCircle.color;
            overlayCtx.lineWidth = WZ.fovCircle.thickness;
            overlayCtx.beginPath();
            overlayCtx.arc(screenCenterX, screenCenterY, WZ.game.fovRadius, 0, 2 * Math.PI);
            overlayCtx.stroke();
        }
        
        // Only render ESP if there are detections (smart render)
        if (WZ.esp.smartRender && filteredDetections.length === 0) return;
        
        const videoRect = gameVideo.getBoundingClientRect();
        const videoAspectRatio = gameVideo.videoWidth / gameVideo.videoHeight;
        const displayAspectRatio = videoRect.width / videoRect.height;
        let videoDisplayWidth = videoRect.width;
        let videoDisplayHeight = videoRect.height;
        let videoDisplayLeft = videoRect.left;
        let videoDisplayTop = videoRect.top;
        
        if (videoAspectRatio > displayAspectRatio) {
            videoDisplayHeight = videoRect.width / videoAspectRatio;
            videoDisplayTop = videoRect.top + (videoRect.height - videoDisplayHeight) / 2;
        } else {
            videoDisplayWidth = videoRect.height * videoAspectRatio;
            videoDisplayLeft = videoRect.left + (videoRect.width - videoDisplayWidth) / 2;
        }
        
        filteredDetections.forEach(det => {
            const [x, y, w, h] = det.bbox;
            const screenX = videoDisplayLeft + (x / gameVideo.videoWidth) * videoDisplayWidth;
            const screenY = videoDisplayTop + (y / gameVideo.videoHeight) * videoDisplayHeight;
            const screenW = (w / gameVideo.videoWidth) * videoDisplayWidth;
            const screenH = (h / gameVideo.videoHeight) * videoDisplayHeight;
            
            const isCurrentTarget = currentTarget && 
                currentTarget.detection.bbox[0] === det.bbox[0] && 
                currentTarget.detection.bbox[1] === det.bbox[1];
            
            const color = WZ.esp.rgbMode ? utils.getRgbColor() : (isCurrentTarget ? '#00FF00' : WZ.esp.boxes.color);
            
            // Draw bounding box
            if (WZ.esp.boxes.enabled) {
                overlayCtx.strokeStyle = color;
                overlayCtx.lineWidth = isCurrentTarget ? 3 : WZ.esp.boxes.thickness;
                overlayCtx.strokeRect(screenX, screenY, screenW, screenH);
                
                if (WZ.esp.boxes.filled) {
                    overlayCtx.fillStyle = color.replace(')', ', 0.1)').replace('rgb', 'rgba');
                    overlayCtx.fillRect(screenX, screenY, screenW, screenH);
                }
            }
            
            // Draw glow
            if (WZ.esp.glow.enabled) {
                overlayCtx.shadowBlur = WZ.esp.glow.blur;
                overlayCtx.shadowColor = color;
                overlayCtx.strokeRect(screenX, screenY, screenW, screenH);
                overlayCtx.shadowBlur = 0;
            }
            
            // Draw snapline
            if (WZ.esp.snaplines.enabled) {
                overlayCtx.strokeStyle = WZ.esp.rgbMode ? utils.getRgbColor(120) : WZ.esp.snaplines.color;
                overlayCtx.lineWidth = WZ.esp.snaplines.thickness;
                overlayCtx.beginPath();
                const snapY = WZ.esp.snaplines.position === 'bottom' ? window.innerHeight : screenCenterY;
                overlayCtx.moveTo(screenCenterX, snapY);
                overlayCtx.lineTo(screenX + screenW / 2, screenY + screenH);
                overlayCtx.stroke();
            }
            
            // Draw head dot
            if (WZ.esp.headDot.enabled) {
                const headX = screenX + screenW / 2;
                const headY = screenY + screenH * 0.1;
                overlayCtx.fillStyle = WZ.esp.rgbMode ? utils.getRgbColor(240) : WZ.esp.headDot.color;
                overlayCtx.beginPath();
                overlayCtx.arc(headX, headY, WZ.esp.headDot.size, 0, 2 * Math.PI);
                overlayCtx.fill();
            }
            
            // Draw name and distance
            overlayCtx.font = '12px monospace';
            let textY = screenY - 8;
            
            if (WZ.esp.names.enabled) {
                overlayCtx.fillStyle = WZ.esp.names.color;
                overlayCtx.fillText(det.class, screenX + 2, textY);
                textY -= 14;
            }
            
            if (WZ.esp.distance.enabled) {
                const dist = Math.round(utils.distance(screenX + screenW / 2, screenY + screenH / 2, screenCenterX, screenCenterY));
                overlayCtx.fillStyle = WZ.esp.distance.color;
                overlayCtx.fillText(`${dist}px`, screenX + 2, textY);
            }
            
            // Draw confidence
            overlayCtx.fillStyle = '#FFFF00';
            overlayCtx.fillText(`${(det.score * 100).toFixed(0)}%`, screenX + 2, screenY + screenH + 14);
        });
    }

    // ============================================================
    // CROSSHAIR
    // ============================================================
    let crosshairElement = null;
    
    function updateCrosshair() {
        if (!crosshairElement) return;
        
        const size = WZ.crosshair.size;
        const color = WZ.crosshair.rgbMode ? utils.getRgbColor(180) : WZ.crosshair.color;
        const thickness = WZ.crosshair.thickness;
        const gap = WZ.crosshair.gap;
        
        crosshairElement.style.display = WZ.crosshair.enabled ? 'block' : 'none';
        
        if (WZ.crosshair.style === 'cross') {
            crosshairElement.style.cssText = `
                position: fixed; top: 50%; left: 50%; 
                width: ${size}px; height: ${size}px;
                transform: translate(-50%, -50%);
                pointer-events: none; z-index: 1000000;
                display: ${WZ.crosshair.enabled ? 'block' : 'none'};
            `;
            crosshairElement.innerHTML = `
                <div style="position:absolute;top:50%;left:${gap}px;width:${size/2-gap}px;height:${thickness}px;background:${color};transform:translateY(-50%);"></div>
                <div style="position:absolute;top:50%;right:${gap}px;width:${size/2-gap}px;height:${thickness}px;background:${color};transform:translateY(-50%);"></div>
                <div style="position:absolute;left:50%;top:${gap}px;height:${size/2-gap}px;width:${thickness}px;background:${color};transform:translateX(-50%);"></div>
                <div style="position:absolute;left:50%;bottom:${gap}px;height:${size/2-gap}px;width:${thickness}px;background:${color};transform:translateX(-50%);"></div>
            `;
        } else if (WZ.crosshair.style === 'dot') {
            crosshairElement.style.cssText = `
                position: fixed; top: 50%; left: 50%; 
                width: ${size}px; height: ${size}px;
                border-radius: 50%; background: ${color};
                transform: translate(-50%, -50%);
                pointer-events: none; z-index: 1000000;
                display: ${WZ.crosshair.enabled ? 'block' : 'none'};
            `;
            crosshairElement.innerHTML = '';
        } else if (WZ.crosshair.style === 'circle') {
            crosshairElement.style.cssText = `
                position: fixed; top: 50%; left: 50%; 
                width: ${size}px; height: ${size}px;
                border: ${thickness}px solid ${color};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none; z-index: 1000000;
                display: ${WZ.crosshair.enabled ? 'block' : 'none'};
            `;
            crosshairElement.innerHTML = '';
        }
    }
    
    function createCrosshair() {
        if (document.getElementById('wz-crosshair')) {
            crosshairElement = document.getElementById('wz-crosshair');
        } else {
            crosshairElement = document.createElement('div');
            crosshairElement.id = 'wz-crosshair';
            document.body.appendChild(crosshairElement);
        }
        updateCrosshair();
        utils.log('Crosshair created');
    }

    // ============================================================
    // OVERLAY CANVAS
    // ============================================================
    function createOverlayCanvas() {
        overlayCanvas = document.createElement('canvas');
        overlayCanvas.id = 'wz-overlay';
        overlayCanvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 999999;
        `;
        document.body.appendChild(overlayCanvas);
        overlayCtx = overlayCanvas.getContext('2d');
        overlayCanvas.width = window.innerWidth;
        overlayCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            overlayCanvas.width = window.innerWidth;
            overlayCanvas.height = window.innerHeight;
        });
        
        utils.log('Overlay canvas created');
    }

    // ============================================================
    // MAIN LOOP
    // ============================================================
    function startMainLoop() {
        utils.log('Starting main loop');
        let lastProcessingTime = 0;
        
        function loop() {
            requestAnimationFrame(loop);
            const now = performance.now();
            utils.updateFPS();
            
            // Update RGB hue
            if (WZ.esp.rgbMode || WZ.crosshair.rgbMode) {
                rgbHue = (rgbHue + WZ.esp.rgbSpeed) % 360;
                if (WZ.crosshair.rgbMode) {
                    updateCrosshair(); // Update crosshair color if in RGB mode
                }
            }
            
            // Draw ESP every frame
            if (gameVideo && !gameVideo.paused && !gameVideo.ended) {
                drawESP();
            }
            
            // Process detection at interval
            if (processingFrame || !WZ.detection.enabled || !detectionModel || !gameVideo ||
                gameVideo.paused || gameVideo.ended || gameVideo.videoWidth === 0) {
                if (!WZ.detection.enabled && Input.isShooting) {
                    Input.stopShooting();
                    currentTarget = null;
                    bestTarget = null;
                }
                return;
            }
            
            if (now - lastProcessingTime >= WZ.game.aimInterval) {
                (async () => {
                    processingFrame = true;
                    
                    try {
                        if (gameVideo.readyState >= 2 && gameVideo.videoWidth > 0) {
                            // Run detection
                            allDetections = await detectWithRoboflow(
                                gameVideo,
                                WZ.detection.maxDetections,
                                WZ.detection.confidence
                            );
                            
                            // Apply self filter
                            filteredDetections = applySelfFilter(allDetections);
                            stats.detections = filteredDetections.length;
                            
                            // Select best target
                            bestTarget = selectBestTarget(filteredDetections);
                            
                            // Process aimbot
                            processAimbot(bestTarget);
                        }
                    } catch (e) {
                        utils.error('Detection/Processing Error:', e);
                        if (Input.isShooting) Input.stopShooting();
                        currentTarget = null;
                        bestTarget = null;
                    } finally {
                        lastProcessingTime = performance.now();
                        processingFrame = false;
                    }
                })();
            }
        }
        
        loop();
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    async function initDetectionModel() {
        utils.log('Initializing Roboflow detection model...');
        
        try {
            // Create detection canvas
            detectionCanvas = document.createElement('canvas');
            detectionCtx = detectionCanvas.getContext('2d');
            
            detectionModel = {
                ready: true,
                detect: detectWithRoboflow
            };
            
            utils.log('Roboflow model initialized successfully');
            return true;
        } catch (err) {
            utils.error('Failed to initialize Roboflow model:', err);
            return false;
        }
    }

    async function findGameVideoAndInit() {
        gameVideo = document.querySelector(WZ.game.videoSelector);
        
        if (gameVideo && gameVideo.readyState >= 2 && gameVideo.videoWidth > 0) {
            utils.log(`Game video found: ${gameVideo.videoWidth}x${gameVideo.videoHeight}`);
            
            try {
                if (!await initDetectionModel()) {
                    throw new Error('Model initialization failed');
                }
                
                Input.init();
                createOverlayCanvas();
                createCrosshair();
                createGUI();
                startMainLoop();
                
                utils.log('Warzone Aimbot initialized successfully!');
            } catch (err) {
                utils.error('Fatal error during initialization:', err);
                WZ.detection.enabled = false;
            }
        } else {
            const videoStatus = gameVideo ? 
                `readyState=${gameVideo.readyState}, dims=${gameVideo.videoWidth}x${gameVideo.videoHeight}` : 
                'not found';
            utils.log(`Game video not ready (${videoStatus}), retrying...`);
            setTimeout(findGameVideoAndInit, 1500);
        }
    }

    // Start initialization
    utils.log(`Warzone Aimbot v${WZ.version} loading...`);
    setTimeout(findGameVideoAndInit, 1000);

    // ============================================================
    // GUI CREATION - RED/BLACK THEMED WITH TABS
    // ============================================================
    function createGUI() {
        if (document.getElementById('wz-gui')) return;
        
        guiContainer = document.createElement('div');
        guiContainer.id = 'wz-gui';
        guiContainer.innerHTML = `
            <style>
                #wz-gui {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 800px;
                    height: 600px;
                    background: linear-gradient(145deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%);
                    border: 2px solid #ff0000;
                    border-radius: 16px;
                    z-index: 100002;
                    font-family: 'Segoe UI', sans-serif;
                    font-size: 12px;
                    color: #e0e0e0;
                    box-shadow: 0 0 50px rgba(255,0,0,0.3), inset 0 0 100px rgba(0,0,0,0.7);
                    display: flex;
                    overflow: hidden;
                    user-select: none;
                }
                
                /* Sidebar */
                .wz-sidebar {
                    width: 200px;
                    background: linear-gradient(180deg, #0d0000 0%, #1a0505 100%);
                    border-right: 1px solid #ff000055;
                    padding: 15px 0;
                    display: flex;
                    flex-direction: column;
                }
                
                .wz-logo-section {
                    padding: 15px;
                    text-align: center;
                    border-bottom: 1px solid #ff000055;
                    margin-bottom: 15px;
                }
                
                .wz-logo-title {
                    color: #ff0000;
                    font-size: 22px;
                    font-weight: bold;
                    text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000;
                    letter-spacing: 2px;
                }
                
                .wz-logo-subtitle {
                    color: #ff6666;
                    font-size: 10px;
                    margin-top: 5px;
                    letter-spacing: 1px;
                }
                
                .wz-nav-btn {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-left: 3px solid transparent;
                    margin: 2px 0;
                }
                
                .wz-nav-btn:hover {
                    background: rgba(255,0,0,0.1);
                    color: #ff0000;
                }
                
                .wz-nav-btn.active {
                    background: rgba(255,0,0,0.2);
                    color: #ff0000;
                    border-left-color: #ff0000;
                    font-weight: bold;
                }
                
                .wz-nav-icon {
                    font-size: 18px;
                    width: 24px;
                    text-align: center;
                }
                
                /* Main Content */
                .wz-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .wz-header {
                    padding: 15px 20px;
                    background: rgba(0,0,0,0.5);
                    border-bottom: 1px solid #ff000055;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .wz-header-title {
                    color: #ff0000;
                    font-size: 20px;
                    font-weight: bold;
                    text-shadow: 0 0 10px #ff0000;
                }
                
                .wz-header-status {
                    display: flex;
                    gap: 20px;
                    font-size: 11px;
                }
                
                .wz-status-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .wz-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #00ff00;
                    box-shadow: 0 0 10px #00ff00;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .wz-status-dot.red { background: #ff0000; box-shadow: 0 0 10px #ff0000; }
                
                .wz-close-btn {
                    background: none;
                    border: none;
                    color: #ff0000;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0 12px;
                    transition: all 0.2s;
                }
                
                .wz-close-btn:hover {
                    text-shadow: 0 0 10px #ff0000;
                    transform: scale(1.2);
                }
                
                .wz-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                .wz-content::-webkit-scrollbar { width: 8px; }
                .wz-content::-webkit-scrollbar-track { background: #0a0a0a; }
                .wz-content::-webkit-scrollbar-thumb { background: #ff0000; border-radius: 4px; }
                .wz-content::-webkit-scrollbar-thumb:hover { background: #ff3333; }
                
                /* Tab Content */
                .wz-tab { display: none; }
                .wz-tab.active { display: block; }
                
                /* Dashboard Cards */
                .wz-dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .wz-stat-card {
                    background: linear-gradient(145deg, #1a0505, #0d0000);
                    border: 1px solid #ff000066;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s;
                }
                
                .wz-stat-card:hover {
                    border-color: #ff0000;
                    box-shadow: 0 0 20px rgba(255,0,0,0.3);
                    transform: translateY(-2px);
                }
                
                .wz-stat-value {
                    font-size: 32px;
                    font-weight: bold;
                    color: #ff0000;
                    text-shadow: 0 0 15px #ff0000;
                }
                
                .wz-stat-label {
                    color: #888;
                    font-size: 11px;
                    margin-top: 8px;
                    letter-spacing: 1px;
                }
                
                /* Section Styling */
                .wz-section {
                    background: linear-gradient(145deg, #1a0505, #0d0000);
                    border: 1px solid #ff000066;
                    border-radius: 12px;
                    padding: 18px;
                    margin-bottom: 15px;
                }
                
                .wz-section-title {
                    color: #ff0000;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ff000044;
                    text-shadow: 0 0 8px #ff0000;
                }
                
                .wz-section-desc {
                    color: #666;
                    font-size: 10px;
                    margin-bottom: 12px;
                    font-style: italic;
                }
                
                /* Controls */
                .wz-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                
                .wz-grid-3 {
                    grid-template-columns: repeat(3, 1fr);
                }
                
                .wz-toggle {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 14px;
                    background: rgba(0,0,0,0.4);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                
                .wz-toggle:hover {
                    background: rgba(255,0,0,0.1);
                    border-color: #ff000044;
                }
                
                .wz-toggle input {
                    accent-color: #ff0000;
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                
                .wz-slider-row {
                    margin-bottom: 15px;
                }
                
                .wz-slider-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    color: #aaa;
                }
                
                .wz-slider-value {
                    color: #ff0000;
                    font-weight: bold;
                    text-shadow: 0 0 5px #ff0000;
                }
                
                input[type="range"] {
                    width: 100%;
                    height: 6px;
                    background: linear-gradient(90deg, #0a0a0a, #1a0000);
                    border-radius: 3px;
                    outline: none;
                    -webkit-appearance: none;
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #ff0000;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px #ff0000;
                }
                
                input[type="range"]::-webkit-slider-thumb:hover {
                    background: #ff3333;
                    box-shadow: 0 0 15px #ff0000;
                }
                
                select {
                    background: #0a0a0a;
                    color: #ff0000;
                    border: 1px solid #ff000066;
                    padding: 10px 14px;
                    border-radius: 8px;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.2s;
                }
                
                select:focus {
                    outline: none;
                    border-color: #ff0000;
                    box-shadow: 0 0 10px rgba(255,0,0,0.3);
                }
                
                select:hover {
                    border-color: #ff0000;
                }
                
                .wz-row {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    margin-top: 12px;
                }
                
                .wz-row > * {
                    flex: 1;
                }
                
                /* Info Cards */
                .wz-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .wz-info-card {
                    background: linear-gradient(145deg, #1a0505, #0d0000);
                    border: 1px solid #ff000066;
                    border-radius: 12px;
                    padding: 18px;
                }
                
                .wz-info-card-title {
                    color: #ff0000;
                    font-size: 13px;
                    font-weight: bold;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .wz-info-card-content {
                    color: #aaa;
                    font-size: 11px;
                    line-height: 1.8;
                }
                
                /* Footer */
                .wz-footer {
                    padding: 12px 20px;
                    background: rgba(0,0,0,0.5);
                    border-top: 1px solid #ff000055;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 10px;
                    color: #666;
                }
                
                .wz-footer-brand {
                    color: #ff0000;
                    font-weight: bold;
                    text-shadow: 0 0 5px #ff0000;
                }
                
                /* Button */
                .wz-btn {
                    padding: 10px 20px;
                    background: linear-gradient(90deg, #ff0000, #cc0000);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .wz-btn:hover {
                    background: linear-gradient(90deg, #ff3333, #ff0000);
                    box-shadow: 0 0 15px rgba(255,0,0,0.5);
                    transform: translateY(-1px);
                }
            </style>
            
            <!-- Sidebar -->
            <div class="wz-sidebar">
                <div class="wz-logo-section">
                    <div class="wz-logo-title">WARZONE</div>
                    <div class="wz-logo-subtitle">ULTIMATE v${WZ.version}</div>
                </div>
                
                <div class="wz-nav-btn active" data-tab="dashboard">
                    <span class="wz-nav-icon">📊</span>
                    <span>Dashboard</span>
                </div>
                <div class="wz-nav-btn" data-tab="aimbot">
                    <span class="wz-nav-icon">🎯</span>
                    <span>Aimbot</span>
                </div>
                <div class="wz-nav-btn" data-tab="esp">
                    <span class="wz-nav-icon">👁️</span>
                    <span>ESP</span>
                </div>
                <div class="wz-nav-btn" data-tab="misc">
                    <span class="wz-nav-icon">⚙️</span>
                    <span>Misc</span>
                </div>
                <div class="wz-nav-btn" data-tab="settings">
                    <span class="wz-nav-icon">🔧</span>
                    <span>Settings</span>
                </div>
                <div class="wz-nav-btn" data-tab="models">
                    <span class="wz-nav-icon">🤖</span>
                    <span>Models</span>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="wz-main">
                <div class="wz-header">
                    <div class="wz-header-title" id="wz-page-title">System Dashboard</div>
                    <div class="wz-header-status">
                        <div class="wz-status-item">
                            <div class="wz-status-dot" id="wz-status-dot"></div>
                            <span id="wz-status-text">Active</span>
                        </div>
                        <div class="wz-status-item">
                            <span>FPS: <span id="wz-fps">0</span></span>
                        </div>
                        <div class="wz-status-item">
                            <span>Model MS: <span id="wz-model-ms" style="color:#ff0000;font-weight:bold;">0</span></span>
                        </div>
                        <div class="wz-status-item">
                            <span>Targets: <span id="wz-targets">0</span></span>
                        </div>
                    </div>
                    <button class="wz-close-btn" id="wz-close">×</button>
                </div>
                
                <div class="wz-content">
                    <!-- Dashboard Tab -->
                    <div class="wz-tab active" id="tab-dashboard">
                        <div class="wz-dashboard-grid">
                            <div class="wz-stat-card">
                                <div class="wz-stat-value" id="wz-stat-fps">0</div>
                                <div class="wz-stat-label">FPS</div>
                            </div>
                            <div class="wz-stat-card">
                                <div class="wz-stat-value" id="wz-stat-targets">0</div>
                                <div class="wz-stat-label">TARGETS</div>
                            </div>
                            <div class="wz-stat-card">
                                <div class="wz-stat-value" id="wz-stat-model-ms">0ms</div>
                                <div class="wz-stat-label">MODEL LATENCY</div>
                            </div>
                        </div>
                        
                        <div class="wz-info-grid">
                            <div class="wz-info-card">
                                <div class="wz-info-card-title">🤖 Detection Model</div>
                                <div class="wz-info-card-content">
                                    <b>Type:</b> Roboflow 3.0 Fast<br>
                                    <b>Model:</b> cod-mw-warzone-7vnnf-eodmc/4<br>
                                    <b>Status:</b> <span style="color:#00ff00">Online</span><br>
                                    <b>Confidence:</b> <span id="wz-conf-display">${(WZ.detection.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div class="wz-info-card">
                                <div class="wz-info-card-title">🎯 Aimbot Status</div>
                                <div class="wz-info-card-content">
                                    <b>Mode:</b> <span id="wz-aimbot-mode">Instant Lock</span><br>
                                    <b>Target Bone:</b> <span id="wz-target-bone">Head</span><br>
                                    <b>FOV Radius:</b> ${WZ.game.fovRadius}px<br>
                                    <b>Auto Shoot:</b> <span style="color:#00ff00">Enabled</span>
                                </div>
                            </div>
                            <div class="wz-info-card">
                                <div class="wz-info-card-title">👁️ ESP Features</div>
                                <div class="wz-info-card-content">
                                    <b>Bounding Boxes:</b> <span style="color:#00ff00">Active</span><br>
                                    <b>Enemy Box:</b> 512x512px (Forced)<br>
                                    <b>Head Box:</b> 64x64px (Forced)<br>
                                    <b>Smart Render:</b> <span style="color:#00ff00">Enabled</span>
                                </div>
                            </div>
                            <div class="wz-info-card">
                                <div class="wz-info-card-title">⚡ Performance</div>
                                <div class="wz-info-card-content">
                                    <b>Aim Interval:</b> ${WZ.game.aimInterval}ms<br>
                                    <b>Max FPS:</b> ${WZ.performance.maxFPS}<br>
                                    <b>Low Latency:</b> <span style="color:#00ff00">Enabled</span><br>
                                    <b>Frame Skip:</b> ${WZ.performance.frameSkip}
                                </div>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">⚡ Quick Toggles</div>
                            <div class="wz-section-desc">Quickly enable/disable core features</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-quick-aimbot" ${WZ.aimbot.enabled ? 'checked' : ''}> Aimbot
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-quick-esp" ${WZ.esp.enabled ? 'checked' : ''}> ESP
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Aimbot Tab -->
                    <div class="wz-tab" id="tab-aimbot">
                        <div class="wz-section">
                            <div class="wz-section-title">🎯 Aimbot Configuration</div>
                            <div class="wz-section-desc">Configure aim assistance for precise targeting</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-aimbot-enabled" ${WZ.aimbot.enabled ? 'checked' : ''}> Enable Aimbot
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-instant-lock" ${WZ.aimbot.instantLock ? 'checked' : ''}> Instant Lock
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-sticky-aim" ${WZ.aimbot.stickyAim.enabled ? 'checked' : ''}> Sticky Aim
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-prediction" ${WZ.aimbot.prediction.enabled ? 'checked' : ''}> Prediction
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-smoothing" ${WZ.aimbot.smoothing.enabled ? 'checked' : ''}> Smoothing
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-auto-shoot" ${WZ.aimbot.autoShoot ? 'checked' : ''}> Auto Shoot (Q)
                                </label>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🦴 Aim Bones & Priority</div>
                            <div class="wz-section-desc">Select target bone and priority mode</div>
                            
                            <div class="wz-row">
                                <div>
                                    <label>Target Bone:</label>
                                    <select id="wz-aim-bone">
                                        <option value="head" ${WZ.aimbot.aimBone === 'head' ? 'selected' : ''}>Head (Best)</option>
                                        <option value="neck" ${WZ.aimbot.aimBone === 'neck' ? 'selected' : ''}>Neck</option>
                                        <option value="chest" ${WZ.aimbot.aimBone === 'chest' ? 'selected' : ''}>Chest</option>
                                        <option value="center" ${WZ.aimbot.aimBone === 'center' ? 'selected' : ''}>Center</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Target Priority:</label>
                                    <select id="wz-priority">
                                        <option value="closest" ${WZ.aimbot.targetPriority === 'closest' ? 'selected' : ''}>Closest to Mouse</option>
                                        <option value="center" ${WZ.aimbot.targetPriority === 'center' ? 'selected' : ''}>Closest to Center</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">⚡ Strength & Speed</div>
                            <div class="wz-section-desc">Adjust aimbot power and lock speed</div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Aimbot Strength:</span>
                                    <span class="wz-slider-value"><span id="wz-strength-val">${WZ.aimbot.strength}</span>%</span>
                                </div>
                                <input type="range" id="wz-strength" min="0" max="100" step="5" value="${WZ.aimbot.strength}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Lock Speed:</span>
                                    <span class="wz-slider-value"><span id="wz-lock-speed-val">${WZ.aimbot.lockSpeed.toFixed(1)}</span></span>
                                </div>
                                <input type="range" id="wz-lock-speed" min="0.1" max="1.0" step="0.1" value="${WZ.aimbot.lockSpeed}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Smoothing Factor:</span>
                                    <span class="wz-slider-value"><span id="wz-smooth-val">${WZ.aimbot.smoothing.factor.toFixed(2)}</span></span>
                                </div>
                                <input type="range" id="wz-smooth-factor" min="0.1" max="1.0" step="0.05" value="${WZ.aimbot.smoothing.factor}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Prediction Factor:</span>
                                    <span class="wz-slider-value"><span id="wz-pred-val">${WZ.aimbot.prediction.factor.toFixed(2)}</span></span>
                                </div>
                                <input type="range" id="wz-pred-factor" min="0.0" max="1.0" step="0.05" value="${WZ.aimbot.prediction.factor}">
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🎮 FOV & Sticky Aim</div>
                            <div class="wz-section-desc">Configure field of view and sticky aim radius</div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>FOV Radius:</span>
                                    <span class="wz-slider-value"><span id="wz-fov-val">${WZ.game.fovRadius}</span>px</span>
                                </div>
                                <input type="range" id="wz-fov-radius" min="50" max="500" step="10" value="${WZ.game.fovRadius}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Sticky Aim Radius:</span>
                                    <span class="wz-slider-value"><span id="wz-sticky-val">${WZ.aimbot.stickyAim.radius}</span>px</span>
                                </div>
                                <input type="range" id="wz-sticky-radius" min="10" max="150" step="5" value="${WZ.aimbot.stickyAim.radius}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- ESP Tab -->
                    <div class="wz-tab" id="tab-esp">
                        <div class="wz-section">
                            <div class="wz-section-title">👁️ ESP Configuration</div>
                            <div class="wz-section-desc">Configure visual ESP features</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-enabled" ${WZ.esp.enabled ? 'checked' : ''}> Enable ESP
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-boxes" ${WZ.esp.boxes.enabled ? 'checked' : ''}> Bounding Boxes
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-snaplines" ${WZ.esp.snaplines.enabled ? 'checked' : ''}> Snaplines
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-names" ${WZ.esp.names.enabled ? 'checked' : ''}> Names
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-distance" ${WZ.esp.distance.enabled ? 'checked' : ''}> Distance
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-head-dot" ${WZ.esp.headDot.enabled ? 'checked' : ''}> Head Dot
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-glow" ${WZ.esp.glow.enabled ? 'checked' : ''}> Glow Effect
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-esp-smart-render" ${WZ.esp.smartRender ? 'checked' : ''}> Smart Render
                                </label>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">📦 Detection Box Configuration</div>
                            <div class="wz-section-desc">Force detection box sizes for consistent targeting</div>
                            
                            <label class="wz-toggle">
                                <input type="checkbox" id="wz-force-box-size" ${WZ.detection.forceBoxSize ? 'checked' : ''}> Force Box Sizes
                            </label>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Enemy Box Size:</span>
                                    <span class="wz-slider-value"><span id="wz-enemy-box-val">${WZ.detection.enemyBoxSize}</span>px</span>
                                </div>
                                <input type="range" id="wz-enemy-box-size" min="128" max="1024" step="64" value="${WZ.detection.enemyBoxSize}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Head Box Size:</span>
                                    <span class="wz-slider-value"><span id="wz-head-box-val">${WZ.detection.headBoxSize}</span>px</span>
                                </div>
                                <input type="range" id="wz-head-box-size" min="32" max="256" step="16" value="${WZ.detection.headBoxSize}">
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🎨 Visual Styling</div>
                            <div class="wz-section-desc">Customize ESP colors and effects</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-rgb-mode" ${WZ.esp.rgbMode ? 'checked' : ''}> RGB Mode
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-fov-circle" ${WZ.fovCircle.enabled ? 'checked' : ''}> FOV Circle
                                </label>
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Box Thickness:</span>
                                    <span class="wz-slider-value"><span id="wz-box-thick-val">${WZ.esp.boxes.thickness}</span>px</span>
                                </div>
                                <input type="range" id="wz-box-thickness" min="1" max="5" step="1" value="${WZ.esp.boxes.thickness}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Glow Blur:</span>
                                    <span class="wz-slider-value"><span id="wz-glow-val">${WZ.esp.glow.blur}</span>px</span>
                                </div>
                                <input type="range" id="wz-glow-blur" min="0" max="20" step="1" value="${WZ.esp.glow.blur}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>RGB Speed:</span>
                                    <span class="wz-slider-value"><span id="wz-rgb-speed-val">${WZ.esp.rgbSpeed}</span></span>
                                </div>
                                <input type="range" id="wz-rgb-speed" min="1" max="10" step="1" value="${WZ.esp.rgbSpeed}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Misc Tab -->
                    <div class="wz-tab" id="tab-misc">
                        <div class="wz-section">
                            <div class="wz-section-title">⚡ Rage Features</div>
                            <div class="wz-section-desc">Advanced combat features</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-rage-enabled" ${WZ.rage.enabled ? 'checked' : ''}> Enable Rage Mode
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-no-recoil" ${WZ.rage.noRecoil ? 'checked' : ''}> No Recoil
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-trigger-bot" ${WZ.rage.triggerBot ? 'checked' : ''}> Trigger Bot
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-auto-fire" ${WZ.rage.autoFire ? 'checked' : ''}> Auto Fire
                                </label>
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Recoil Level:</span>
                                    <span class="wz-slider-value"><span id="wz-recoil-val">${WZ.rage.recoilLevel}</span></span>
                                </div>
                                <input type="range" id="wz-recoil-level" min="1" max="4" step="1" value="${WZ.rage.recoilLevel}">
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🎯 Crosshair</div>
                            <div class="wz-section-desc">Customize your crosshair</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-crosshair-enabled" ${WZ.crosshair.enabled ? 'checked' : ''}> Enable Crosshair
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-crosshair-rgb" ${WZ.crosshair.rgbMode ? 'checked' : ''}> RGB Crosshair
                                </label>
                            </div>
                            
                            <div class="wz-row">
                                <div>
                                    <label>Crosshair Style:</label>
                                    <select id="wz-crosshair-style">
                                        <option value="cross" ${WZ.crosshair.style === 'cross' ? 'selected' : ''}>Cross</option>
                                        <option value="dot" ${WZ.crosshair.style === 'dot' ? 'selected' : ''}>Dot</option>
                                        <option value="circle" ${WZ.crosshair.style === 'circle' ? 'selected' : ''}>Circle</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Crosshair Size:</span>
                                    <span class="wz-slider-value"><span id="wz-cross-size-val">${WZ.crosshair.size}</span>px</span>
                                </div>
                                <input type="range" id="wz-crosshair-size" min="5" max="30" step="1" value="${WZ.crosshair.size}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Crosshair Thickness:</span>
                                    <span class="wz-slider-value"><span id="wz-cross-thick-val">${WZ.crosshair.thickness}</span>px</span>
                                </div>
                                <input type="range" id="wz-crosshair-thickness" min="1" max="5" step="1" value="${WZ.crosshair.thickness}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Crosshair Gap:</span>
                                    <span class="wz-slider-value"><span id="wz-cross-gap-val">${WZ.crosshair.gap}</span>px</span>
                                </div>
                                <input type="range" id="wz-crosshair-gap" min="0" max="10" step="1" value="${WZ.crosshair.gap}">
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">⌨️ Keybinds</div>
                            <div class="wz-section-desc">Configure your aimbot and UI keybinds</div>
                            
                            <div class="wz-info-card-content">
                                <div class="wz-row" style="margin-bottom: 10px;">
                                    <label style="flex: 1;">Aimbot Key:</label>
                                    <input type="text" id="wz-aim-key-display" value="${WZ.aimbot.aimKeyDisplay}" readonly style="flex: 1; text-align: center; cursor: pointer;">
                                </div>
                                <div class="wz-row">
                                    <label style="flex: 1;">Toggle UI Key:</label>
                                    <input type="text" id="wz-toggle-key-display" value="${WZ.toggleKeys.alt ? 'Alt+' : ''}${WZ.toggleKeys.ctrl ? 'Ctrl+' : ''}T" readonly style="flex: 1; text-align: center; cursor: default;">
                                </div>
                                <div style="color:#666; font-size:10px; margin-top:10px;">Click the Aimbot Key box to change it.</div>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🛡️ Self Filter</div>
                            <div class="wz-section-desc">Filter out false detections</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-self-filter" ${WZ.selfFilter.enabled ? 'checked' : ''}> Enable Self Filter
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-dead-zone" ${WZ.selfFilter.deadZone.enabled ? 'checked' : ''}> Dead Zone Filter
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-bottom-screen" ${WZ.selfFilter.bottomScreen.enabled ? 'checked' : ''}> Bottom Screen Filter
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-size-filter" ${WZ.selfFilter.sizeFilter.enabled ? 'checked' : ''}> Size Filter
                                </label>
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Dead Zone Radius:</span>
                                    <span class="wz-slider-value"><span id="wz-deadzone-val">${WZ.selfFilter.deadZone.radius}</span>px</span>
                                </div>
                                <input type="range" id="wz-deadzone-radius" min="0" max="200" step="5" value="${WZ.selfFilter.deadZone.radius}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Settings Tab -->
                    <div class="wz-tab" id="tab-settings">
                        <div class="wz-section">
                            <div class="wz-section-title">⚙️ Performance Settings</div>
                            <div class="wz-section-desc">Optimize performance for your system</div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Aim Interval:</span>
                                    <span class="wz-slider-value"><span id="wz-aim-interval-val">${WZ.game.aimInterval}</span>ms</span>
                                </div>
                                <input type="range" id="wz-aim-interval" min="10" max="200" step="10" value="${WZ.game.aimInterval}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Max FPS:</span>
                                    <span class="wz-slider-value"><span id="wz-max-fps-val">${WZ.performance.maxFPS}</span></span>
                                </div>
                                <input type="range" id="wz-max-fps" min="30" max="240" step="10" value="${WZ.performance.maxFPS}">
                            </div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-low-latency" ${WZ.performance.lowLatency ? 'checked' : ''}> Low Latency Mode
                                </label>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🐛 Debug Options</div>
                            <div class="wz-section-desc">Enable debugging features</div>
                            
                            <div class="wz-grid">
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-debug-enabled" ${WZ.debug.enabled ? 'checked' : ''}> Enable Debug Logs
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-show-stats" ${WZ.debug.showStats ? 'checked' : ''}> Show Stats
                                </label>
                                <label class="wz-toggle">
                                    <input type="checkbox" id="wz-log-movement" ${WZ.debug.logMovement ? 'checked' : ''}> Log Movement
                                </label>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">💾 Configuration</div>
                            <div class="wz-section-desc">Save and load your settings</div>
                            
                            <div class="wz-row">
                                <button class="wz-btn" id="wz-save-config">Save Config</button>
                                <button class="wz-btn" id="wz-load-config">Load Config</button>
                                <button class="wz-btn" id="wz-reset-config">Reset to Default</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Models Tab -->
                    <div class="wz-tab" id="tab-models">
                        <div class="wz-section">
                            <div class="wz-section-title">🤖 Roboflow Model Configuration</div>
                            <div class="wz-section-desc">Configure your custom Roboflow detection model</div>
                            
                            <div class="wz-row" style="margin-bottom: 15px;">
                                <div>
                                    <label>Select Model:</label>
                                    <select id="wz-model-select">
                                        <option value="model_4" ${WZ.detection.currentModel === 'model_4' ? 'selected' : ''}>Model 4 (3.0 Fast)</option>
                                        <option value="model_5" ${WZ.detection.currentModel === 'model_5' ? 'selected' : ''}>Model 5 (RF-DETR Nano)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="wz-info-card" style="margin-bottom:15px;">
                                <div class="wz-info-card-title">📡 Current Model</div>
                                <div class="wz-info-card-content">
                                    <b>Endpoint:</b> <span id="wz-model-endpoint">${WZ.detection.models[WZ.detection.currentModel].modelEndpoint}</span><br>
                                    <b>API URL:</b> ${WZ.detection.apiUrl}<br>
                                    <b>Type:</b> <span id="wz-model-type">${WZ.detection.models[WZ.detection.currentModel].modelType}</span><br>
                                    <b>Status:</b> <span style="color:#00ff00">Connected</span>
                                </div>
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Detection Confidence:</span>
                                    <span class="wz-slider-value"><span id="wz-confidence-val">${(WZ.detection.confidence * 100).toFixed(0)}</span>%</span>
                                </div>
                                <input type="range" id="wz-confidence" min="10" max="90" step="5" value="${WZ.detection.confidence * 100}">
                            </div>
                            
                            <div class="wz-slider-row">
                                <div class="wz-slider-header">
                                    <span>Max Detections:</span>
                                    <span class="wz-slider-value"><span id="wz-max-det-val">${WZ.detection.maxDetections}</span></span>
                                </div>
                                <input type="range" id="wz-max-detections" min="1" max="50" step="1" value="${WZ.detection.maxDetections}">
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">🎯 Target Classes</div>
                            <div class="wz-section-desc">Classes detected by your model</div>
                            
                            <div class="wz-info-card-content">
                                <b>Enemy Classes:</b> ${WZ.detection.targetClasses.join(', ')}<br>
                                <b>Head Classes:</b> ${WZ.detection.headClasses.join(', ')}<br><br>
                                <i style="color:#666;">These classes are matched against your Roboflow model's output.</i>
                            </div>
                        </div>
                        
                        <div class="wz-section">
                            <div class="wz-section-title">📊 Model Performance</div>
                            <div class="wz-section-desc">Real-time model statistics</div>
                            
                            <div class="wz-dashboard-grid">
                                <div class="wz-stat-card">
                                    <div class="wz-stat-value" id="wz-model-stat-ms">0ms</div>
                                    <div class="wz-stat-label">INFERENCE TIME</div>
                                </div>
                                <div class="wz-stat-card">
                                    <div class="wz-stat-value" id="wz-model-stat-det">0</div>
                                    <div class="wz-stat-label">DETECTIONS</div>
                                </div>
                                <div class="wz-stat-card">
                                    <div class="wz-stat-value" id="wz-model-stat-fps">0</div>
                                    <div class="wz-stat-label">DETECTION FPS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="wz-footer">
                    <div class="wz-footer-brand">WARZONE ULTIMATE AIMBOT v${WZ.version}</div>
                    <div>Roboflow Custom Model | Educational Use Only</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(guiContainer);
        
        // Setup event listeners
        setupGUIEventListeners();
        
        // Setup tab switching
        document.querySelectorAll('.wz-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });
        
        // Close button
        document.getElementById('wz-close').addEventListener('click', () => {
            guiContainer.style.display = 'none';
        });
        
        // Toggle UI with Alt+Ctrl
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.ctrlKey) {
                guiContainer.style.display = guiContainer.style.display === 'none' ? 'flex' : 'none';
            }
        });
        
        // Start stats update loop
        setInterval(updateGUIStats, 100);
        
        utils.log('GUI created');
    }

    function switchTab(tabName) {
        WZ.currentTab = tabName;
        
        // Update nav buttons
        document.querySelectorAll('.wz-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tabs
        document.querySelectorAll('.wz-tab').forEach(tab => {
            tab.classList.toggle('active', tab.id === `tab-${tabName}`);
        });
        
        // Update title
        const titles = {
            dashboard: 'System Dashboard',
            aimbot: 'Aimbot Configuration',
            esp: 'ESP Configuration',
            misc: 'Miscellaneous Features',
            settings: 'Settings & Performance',
            models: 'Model Configuration'
        };
        
        document.getElementById('wz-page-title').textContent = titles[tabName] || 'Dashboard';
    }

    function setupGUIEventListeners() {
        // Aimbot controls
        document.getElementById('wz-aimbot-enabled').onchange = (e) => {
            WZ.aimbot.enabled = e.target.checked;
            utils.log(`Aimbot ${e.target.checked ? 'enabled' : 'disabled'}`);
        };
        
        document.getElementById('wz-instant-lock').onchange = (e) => WZ.aimbot.instantLock = e.target.checked;
        document.getElementById('wz-sticky-aim').onchange = (e) => WZ.aimbot.stickyAim.enabled = e.target.checked;
        document.getElementById('wz-prediction').onchange = (e) => WZ.aimbot.prediction.enabled = e.target.checked;
        document.getElementById('wz-smoothing').onchange = (e) => WZ.aimbot.smoothing.enabled = e.target.checked;
        document.getElementById('wz-auto-shoot').onchange = (e) => WZ.aimbot.autoShoot = e.target.checked;
        
        document.getElementById('wz-aim-bone').onchange = (e) => {
            WZ.aimbot.aimBone = e.target.value;
            document.getElementById('wz-target-bone').textContent = WZ.aimbot.aimBones[e.target.value].name;
        };
        
        document.getElementById('wz-priority').onchange = (e) => WZ.aimbot.targetPriority = e.target.value;
        
        // Sliders
        document.getElementById('wz-strength').oninput = (e) => {
            WZ.aimbot.strength = parseInt(e.target.value);
            document.getElementById('wz-strength-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-lock-speed').oninput = (e) => {
            WZ.aimbot.lockSpeed = parseFloat(e.target.value);
            document.getElementById('wz-lock-speed-val').textContent = parseFloat(e.target.value).toFixed(1);
        };
        
        document.getElementById('wz-smooth-factor').oninput = (e) => {
            WZ.aimbot.smoothing.factor = parseFloat(e.target.value);
            document.getElementById('wz-smooth-val').textContent = parseFloat(e.target.value).toFixed(2);
        };
        
        document.getElementById('wz-pred-factor').oninput = (e) => {
            WZ.aimbot.prediction.factor = parseFloat(e.target.value);
            document.getElementById('wz-pred-val').textContent = parseFloat(e.target.value).toFixed(2);
        };
        
        document.getElementById('wz-fov-radius').oninput = (e) => {
            WZ.game.fovRadius = parseInt(e.target.value);
            document.getElementById('wz-fov-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-sticky-radius').oninput = (e) => {
            WZ.aimbot.stickyAim.radius = parseInt(e.target.value);
            document.getElementById('wz-sticky-val').textContent = e.target.value;
        };
        
        // ESP controls
        document.getElementById('wz-esp-enabled').onchange = (e) => WZ.esp.enabled = e.target.checked;
        document.getElementById('wz-esp-boxes').onchange = (e) => WZ.esp.boxes.enabled = e.target.checked;
        document.getElementById('wz-esp-snaplines').onchange = (e) => WZ.esp.snaplines.enabled = e.target.checked;
        document.getElementById('wz-esp-names').onchange = (e) => WZ.esp.names.enabled = e.target.checked;
        document.getElementById('wz-esp-distance').onchange = (e) => WZ.esp.distance.enabled = e.target.checked;
        document.getElementById('wz-esp-head-dot').onchange = (e) => WZ.esp.headDot.enabled = e.target.checked;
        document.getElementById('wz-esp-glow').onchange = (e) => WZ.esp.glow.enabled = e.target.checked;
        document.getElementById('wz-esp-smart-render').onchange = (e) => WZ.esp.smartRender = e.target.checked;
        
        document.getElementById('wz-force-box-size').onchange = (e) => WZ.detection.forceBoxSize = e.target.checked;
        
        document.getElementById('wz-enemy-box-size').oninput = (e) => {
            WZ.detection.enemyBoxSize = parseInt(e.target.value);
            document.getElementById('wz-enemy-box-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-head-box-size').oninput = (e) => {
            WZ.detection.headBoxSize = parseInt(e.target.value);
            document.getElementById('wz-head-box-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-rgb-mode').onchange = (e) => WZ.esp.rgbMode = e.target.checked;
        document.getElementById('wz-fov-circle').onchange = (e) => WZ.fovCircle.enabled = e.target.checked;
        
        document.getElementById('wz-box-thickness').oninput = (e) => {
            WZ.esp.boxes.thickness = parseInt(e.target.value);
            document.getElementById('wz-box-thick-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-glow-blur').oninput = (e) => {
            WZ.esp.glow.blur = parseInt(e.target.value);
            document.getElementById('wz-glow-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-rgb-speed').oninput = (e) => {
            WZ.esp.rgbSpeed = parseInt(e.target.value);
            document.getElementById('wz-rgb-speed-val').textContent = e.target.value;
        };
        
        // Misc controls
        document.getElementById('wz-rage-enabled').onchange = (e) => WZ.rage.enabled = e.target.checked;
        document.getElementById('wz-no-recoil').onchange = (e) => WZ.rage.noRecoil = e.target.checked;
        document.getElementById('wz-trigger-bot').onchange = (e) => WZ.rage.triggerBot = e.target.checked;
        document.getElementById('wz-auto-fire').onchange = (e) => WZ.rage.autoFire = e.target.checked;
        
        document.getElementById('wz-recoil-level').oninput = (e) => {
            WZ.rage.recoilLevel = parseInt(e.target.value);
            document.getElementById('wz-recoil-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-crosshair-enabled').onchange = (e) => { WZ.crosshair.enabled = e.target.checked; updateCrosshair(); };
        document.getElementById('wz-crosshair-rgb').onchange = (e) => { WZ.crosshair.rgbMode = e.target.checked; updateCrosshair(); };
        document.getElementById('wz-crosshair-style').onchange = (e) => { WZ.crosshair.style = e.target.value; updateCrosshair(); };
        
        document.getElementById('wz-crosshair-size').oninput = (e) => {
            WZ.crosshair.size = parseInt(e.target.value);
            document.getElementById('wz-cross-size-val').textContent = e.target.value;
            updateCrosshair();
        };
        
        document.getElementById('wz-crosshair-thickness').oninput = (e) => {
            WZ.crosshair.thickness = parseInt(e.target.value);
            document.getElementById('wz-cross-thick-val').textContent = e.target.value;
            updateCrosshair();
        };
        
        document.getElementById('wz-crosshair-gap').oninput = (e) => {
            WZ.crosshair.gap = parseInt(e.target.value);
            document.getElementById('wz-cross-gap-val').textContent = e.target.value;
            updateCrosshair();
        };
        
        document.getElementById('wz-self-filter').onchange = (e) => WZ.selfFilter.enabled = e.target.checked;
        document.getElementById('wz-dead-zone').onchange = (e) => WZ.selfFilter.deadZone.enabled = e.target.checked;
        document.getElementById('wz-bottom-screen').onchange = (e) => WZ.selfFilter.bottomScreen.enabled = e.target.checked;
        document.getElementById('wz-size-filter').onchange = (e) => WZ.selfFilter.sizeFilter.enabled = e.target.checked;
        
        document.getElementById('wz-deadzone-radius').oninput = (e) => {
            WZ.selfFilter.deadZone.radius = parseInt(e.target.value);
            document.getElementById('wz-deadzone-val').textContent = e.target.value;
        };
        
        // Keybind controls
        let isRemappingKey = false;
        const aimKeyDisplay = document.getElementById('wz-aim-key-display');
        
        aimKeyDisplay.onclick = () => {
            if (isRemappingKey) return;
            isRemappingKey = true;
            aimKeyDisplay.value = 'Press a key or click a mouse button...';
            aimKeyDisplay.style.backgroundColor = '#ff000055';
            
            const finishRemapping = (newKey, newKeyDisplay) => {
                WZ.aimbot.aimKey = newKey;
                WZ.aimbot.aimKeyDisplay = newKeyDisplay;
                aimKeyDisplay.value = newKeyDisplay;
                aimKeyDisplay.style.backgroundColor = 'transparent';
                
                isRemappingKey = false;
                document.removeEventListener('keydown', keyListener, true);
                document.removeEventListener('mousedown', mouseListener, true);
                utils.log(`Aimbot key remapped to: ${newKey}`);
            };
            
            const keyListener = (e) => {
                e.preventDefault();
                e.stopPropagation();
                finishRemapping(e.code, e.key.toUpperCase());
            };
            
            const mouseListener = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const mouseKey = `Mouse${e.button}`;
                const mouseKeyDisplay = `Mouse ${e.button}`;
                finishRemapping(mouseKey, mouseKeyDisplay);
            };
            
            document.addEventListener('keydown', keyListener, true);
            document.addEventListener('mousedown', mouseListener, true);
        };
        
        // Settings controls
        document.getElementById('wz-aim-interval').oninput = (e) => {
            WZ.game.aimInterval = parseInt(e.target.value);
            document.getElementById('wz-aim-interval-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-max-fps').oninput = (e) => {
            WZ.performance.maxFPS = parseInt(e.target.value);
            document.getElementById('wz-max-fps-val').textContent = e.target.value;
        };
        
        document.getElementById('wz-low-latency').onchange = (e) => WZ.performance.lowLatency = e.target.checked;
        document.getElementById('wz-debug-enabled').onchange = (e) => WZ.debug.enabled = e.target.checked;
        document.getElementById('wz-show-stats').onchange = (e) => WZ.debug.showStats = e.target.checked;
        document.getElementById('wz-log-movement').onchange = (e) => WZ.debug.logMovement = e.target.checked;
        
        // Config buttons
        document.getElementById('wz-save-config').onclick = () => {
            localStorage.setItem('warzone_aimbot_config', JSON.stringify(WZ));
            alert('Configuration saved!');
        };
        
        document.getElementById('wz-load-config').onclick = () => {
            const saved = localStorage.getItem('warzone_aimbot_config');
            if (saved) {
                Object.assign(WZ, JSON.parse(saved));
                alert('Configuration loaded!');
                location.reload();
            } else {
                alert('No saved configuration found!');
            }
        };
        
        document.getElementById('wz-reset-config').onclick = () => {
            if (confirm('Reset all settings to default?')) {
                localStorage.removeItem('warzone_aimbot_config');
                location.reload();
            }
        };
        
        // Model controls
        document.getElementById('wz-confidence').oninput = (e) => {
            WZ.detection.confidence = parseInt(e.target.value) / 100;
            document.getElementById('wz-confidence-val').textContent = e.target.value;
            document.getElementById('wz-conf-display').textContent = e.target.value + '%';
        };
        
        document.getElementById('wz-max-detections').oninput = (e) => {
            WZ.detection.maxDetections = parseInt(e.target.value);
            document.getElementById('wz-max-det-val').textContent = e.target.value;
        };
        
        // Model selection control
        document.getElementById('wz-model-select').onchange = (e) => {
            const newModel = e.target.value;
            WZ.detection.currentModel = newModel;
            const modelConfig = WZ.detection.models[newModel];
            
            // Update the legacy fields for backward compatibility with existing logic
            WZ.detection.modelEndpoint = modelConfig.modelEndpoint;
            WZ.detection.modelType = modelConfig.modelType;
            
            // Update GUI display
            document.getElementById('wz-model-endpoint').textContent = modelConfig.modelEndpoint;
            document.getElementById('wz-model-type').textContent = modelConfig.modelType;
            
            utils.log(`Switched to model: ${newModel} (${modelConfig.modelType})`);
        };
        

    }

    function updateGUIStats() {
        if (!guiContainer || guiContainer.style.display === 'none') return;
        
        // Update header stats
        document.getElementById('wz-fps').textContent = stats.fps;
        document.getElementById('wz-model-ms').textContent = stats.modelMs;
        document.getElementById('wz-targets').textContent = stats.detections;
        
        // Update dashboard stats
        document.getElementById('wz-stat-fps').textContent = stats.fps;
        document.getElementById('wz-stat-targets').textContent = stats.detections;
        document.getElementById('wz-stat-model-ms').textContent = stats.modelMs + 'ms';
        
        // Update model stats
        document.getElementById('wz-model-stat-ms').textContent = stats.modelMs + 'ms';
        document.getElementById('wz-model-stat-det').textContent = stats.detections;
        document.getElementById('wz-model-stat-fps').textContent = stats.fps;
        
        // Update status dot
        const statusDot = document.getElementById('wz-status-dot');
        if (WZ.detection.enabled && WZ.aimbot.enabled) {
            statusDot.className = 'wz-status-dot';
            document.getElementById('wz-status-text').textContent = 'Active';
        } else {
            statusDot.className = 'wz-status-dot red';
            document.getElementById('wz-status-text').textContent = 'Inactive';
        }
        
        // Update aimbot mode display
        const mode = WZ.aimbot.instantLock ? 'Instant Lock' : 'Smooth Lock';
        document.getElementById('wz-aimbot-mode').textContent = mode;
    }

})();
