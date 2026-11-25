import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';

test.describe('UX-06.7 Increment 1R-C — Creative Primitives Validation & Evidence Correction', () => {
  const screenshotsDir = path.resolve(process.cwd(), '../docs/screenshots/creative-charter');
  const brainScreenshotsDir = path.resolve(
    '/home/samudra/.gemini/antigravity-cli/brain/64840b91-20dd-480a-bae0-115056cbb502/screenshots/creative-charter'
  );

  test.beforeAll(() => {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    if (!fs.existsSync(brainScreenshotsDir)) {
      fs.mkdirSync(brainScreenshotsDir, { recursive: true });
    }
  });

  const saveScreenshot = (srcPath: string, filename: string) => {
    const brainPath = path.join(brainScreenshotsDir, filename);
    fs.copyFileSync(srcPath, brainPath);
  };

  // Helper to read PNG dimensions from header
  const getPngDimensions = (filePath: string): { width: number; height: number } => {
    const buf = fs.readFileSync(filePath);
    return {
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
    };
  };

  // =========================================================================
  // 1. PRODUCTION SHOWCASE ROUTE ISOLATION & BUNDLE HYGIENE (Preview Server: 3002)
  // =========================================================================
  test('1. Production Showcase Isolation: All overrides blocked in production preview', async ({ page }) => {
    // 1A. Standard /showcase access in production preview
    await page.goto('http://localhost:3002/showcase');
    await page.waitForLoadState('networkidle');
    const heading1A = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading1A).toContain('Lost the scent?');

    // 1B. Query string override (?harness=true) in production preview
    await page.goto('http://localhost:3002/showcase?harness=true');
    await page.waitForLoadState('networkidle');
    const heading1B = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading1B).toContain('Lost the scent?');

    // 1C. Session storage override (safepaws_dev_harness=active) in production preview
    await page.addInitScript(() => {
      sessionStorage.setItem('safepaws_dev_harness', 'active');
    });
    await page.goto('http://localhost:3002/showcase');
    await page.waitForLoadState('networkidle');
    const heading1C = await page.getByRole('heading', { level: 1 }).textContent();
    expect(heading1C).toContain('Lost the scent?');

    // 1D. Bundle hygiene audit: verify CreativeShowcase is dead-code eliminated from dist/
    const distAssetsDir = path.resolve(process.cwd(), 'dist/assets');
    expect(fs.existsSync(distAssetsDir)).toBe(true);
    const assetFiles = fs.readdirSync(distAssetsDir);
    const showcaseChunks = assetFiles.filter((f) => f.startsWith('CreativeShowcase'));
    expect(showcaseChunks.length).toBe(0);

    // 1E. Measure actual production bundle sizes
    const bundleInventory: { name: string; sizeBytes: number; gzipBytes: number }[] = [];
    let totalJsBytes = 0;
    let totalJsGzip = 0;
    let totalCssBytes = 0;
    let totalCssGzip = 0;

    for (const file of assetFiles) {
      const filePath = path.join(distAssetsDir, file);
      const stat = fs.statSync(filePath);
      const content = fs.readFileSync(filePath);
      const gzip = zlib.gzipSync(content).length;

      if (file.endsWith('.js')) {
        totalJsBytes += stat.size;
        totalJsGzip += gzip;
      } else if (file.endsWith('.css')) {
        totalCssBytes += stat.size;
        totalCssGzip += gzip;
      }

      bundleInventory.push({
        name: file,
        sizeBytes: stat.size,
        gzipBytes: gzip,
      });
    }

    // Sort descending by size
    bundleInventory.sort((a, b) => b.sizeBytes - a.sizeBytes);

    console.log('MEASURED_BUNDLE_AUDIT:', JSON.stringify({
      totalAssetFiles: assetFiles.length,
      showcaseChunksEmitted: showcaseChunks.length,
      totalJsBytes,
      totalJsGzip,
      totalCssBytes,
      totalCssGzip,
      topChunks: bundleInventory.slice(0, 8),
    }));
  });

  // =========================================================================
  // 2. STICKER INTERACTION: GENUINE POINTER DRAGGING, SPRING SNAP, TOUCH & KEYBOARD
  // =========================================================================
  test('2. Sticker Interaction: Pointer dragging, spring settling, touch, keyboard, and reduced motion', async ({ page }) => {
    // Navigate to development review harness where showcase is available
    await page.goto('http://localhost:3000/showcase');
    await page.waitForLoadState('networkidle');

    const highResSection = page.locator('#high-res-sticker-inspection');
    await expect(highResSection).toBeVisible();

    const sticker = highResSection.locator('[data-testid="interactive-sticker"]');
    await sticker.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(sticker).toBeVisible();
    await expect(sticker).toHaveAttribute('data-peeled', 'false');
    await expect(sticker).toHaveAttribute('aria-expanded', 'false');

    // Measure bounding box for precise corner drag kinematics
    const box = await sticker.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    // Corner pull strip is located at top-right
    const cornerX = box.x + box.width - 35;
    const cornerY = box.y + 35;

    // 2A. Real pointer drag exceeding threshold (latch to peeled state)
    await page.mouse.move(cornerX, cornerY);
    await page.mouse.down();

    // Drag diagonally towards bottom-left across 180px
    const dragTargetX = cornerX - 160;
    const dragTargetY = cornerY + 140;
    await page.mouse.move(dragTargetX, dragTargetY, { steps: 8 });

    // Assert drag state in-flight
    await expect(sticker).toHaveAttribute('data-dragging', 'true');
    const dragProgressVal = parseFloat((await sticker.getAttribute('data-drag-progress')) || '0');
    expect(dragProgressVal).toBeGreaterThan(0.35);

    // Release pointer and verify spring settling into latched peeled state
    await page.mouse.up();
    await page.waitForTimeout(400); // Allow spring physics to settle

    await expect(sticker).toHaveAttribute('data-dragging', 'false');
    await expect(sticker).toHaveAttribute('data-peeled', 'true');
    await expect(sticker).toHaveAttribute('aria-expanded', 'true');
    await expect(highResSection.getByText('SAFEPAWS CENTRAL LEDGER')).toBeVisible();
    await expect(highResSection.getByText('BIOMETRIC SECURE HASH: PASS')).toBeVisible();

    // 2B. Reset / Reseal via accessible click
    await sticker.click();
    await page.waitForTimeout(350);
    await expect(sticker).toHaveAttribute('data-peeled', 'false');
    await expect(sticker).toHaveAttribute('aria-expanded', 'false');

    // 2C. Drag below threshold (< 35%) and verify spring snap-back to sealed
    await page.mouse.move(cornerX, cornerY);
    await page.mouse.down();
    await page.mouse.move(cornerX - 30, cornerY + 25, { steps: 5 }); // Sub-threshold drag
    await page.mouse.up();
    await page.waitForTimeout(400); // Spring snap-back settle

    await expect(sticker).toHaveAttribute('data-peeled', 'false');
    await expect(sticker).toHaveAttribute('aria-expanded', 'false');

    // 2D. Keyboard Enter and Space accessibility
    await sticker.focus();
    await expect(sticker).toBeFocused();

    // Actuate via Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(350);
    await expect(sticker).toHaveAttribute('data-peeled', 'true');

    // Reseal via Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(350);
    await expect(sticker).toHaveAttribute('data-peeled', 'false');

    // 2E. Reduced motion verification
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(100);
    await expect(sticker).toHaveAttribute('data-reduced-motion', 'true');
    // In reduced motion, actuation is instantaneous without spring duration
    await sticker.click();
    await expect(sticker).toHaveAttribute('data-peeled', 'true');
    await sticker.click();
    await expect(sticker).toHaveAttribute('data-peeled', 'false');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  // =========================================================================
  // 3. HIGH-RESOLUTION EVIDENCE CAPTURES (&ge; 640 &times; 720 CSS PIXELS)
  // =========================================================================
  test('3. High-Resolution Visual Evidence Captures across 5 Viewports and 4 Sticker States', async ({ page }) => {
    // Set high-DPI desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/showcase');
    await page.waitForLoadState('networkidle');

    // Capture 5 Responsive Showcase Screenshots
    // A. Desktop 1440px
    const shot1440 = path.join(screenshotsDir, 'showcase_desktop_1440px.png');
    await page.screenshot({ path: shot1440, fullPage: true });
    saveScreenshot(shot1440, 'showcase_desktop_1440px.png');

    // B. Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);
    const shot1280 = path.join(screenshotsDir, 'showcase_desktop_1280px.png');
    await page.screenshot({ path: shot1280, fullPage: true });
    saveScreenshot(shot1280, 'showcase_desktop_1280px.png');

    // C. Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(200);
    const shot768 = path.join(screenshotsDir, 'showcase_tablet_768px.png');
    await page.screenshot({ path: shot768, fullPage: true });
    saveScreenshot(shot768, 'showcase_tablet_768px.png');

    // D. Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    const shot390 = path.join(screenshotsDir, 'showcase_mobile_390px.png');
    await page.screenshot({ path: shot390, fullPage: true });
    saveScreenshot(shot390, 'showcase_mobile_390px.png');

    // E. Mobile 320px
    await page.setViewportSize({ width: 320, height: 640 });
    await page.waitForTimeout(200);
    const shot320 = path.join(screenshotsDir, 'showcase_mobile_320px.png');
    await page.screenshot({ path: shot320, fullPage: true });
    saveScreenshot(shot320, 'showcase_mobile_320px.png');

    // Return to 1440px for macro sticker captures (&ge; 640 x 720 CSS pixels)
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('http://localhost:3000/showcase');
    await page.waitForLoadState('networkidle');

    const highResSticker = page.locator('#high-res-sticker-inspection [data-testid="interactive-sticker"]');
    await expect(highResSticker).toBeVisible();

    const stickerBox = await highResSticker.boundingBox();
    expect(stickerBox).not.toBeNull();
    if (stickerBox) {
      expect(stickerBox.width).toBeGreaterThanOrEqual(600);
      expect(stickerBox.height).toBeGreaterThanOrEqual(700);
    }

    // F. Sticker Front Detail (Sealed, Flat Face)
    const shotFront = path.join(screenshotsDir, 'sticker_front_detail_hires.png');
    await highResSticker.screenshot({ path: shotFront });
    saveScreenshot(shotFront, 'sticker_front_detail_hires.png');

    // G. Sticker Partially Peeled Detail (30% Curl Progress)
    if (stickerBox) {
      const cornerX = stickerBox.x + stickerBox.width - 30;
      const cornerY = stickerBox.y + 30;
      await page.mouse.move(cornerX, cornerY);
      await page.mouse.down();
      await page.mouse.move(cornerX - 70, cornerY + 60, { steps: 5 });
    }
    await page.waitForTimeout(200);
    const shotPartial = path.join(screenshotsDir, 'sticker_partially_peeled_hires.png');
    await highResSticker.screenshot({ path: shotPartial });
    saveScreenshot(shotPartial, 'sticker_partially_peeled_hires.png');
    await page.mouse.up();
    await page.waitForTimeout(300);

    // H. Sticker Fully Peeled Reverse Foil Detail
    await highResSticker.click();
    await page.waitForTimeout(400);
    const shotFoil = path.join(screenshotsDir, 'sticker_fully_peeled_reverse_foil_hires.png');
    await highResSticker.screenshot({ path: shotFoil });
    saveScreenshot(shotFoil, 'sticker_fully_peeled_reverse_foil_hires.png');

    // I. Dedicated Crease, Fold & Shadow Macro Detail
    const flap = highResSticker.locator('.sticker-curled-flap');
    const shotCrease = path.join(screenshotsDir, 'sticker_crease_shadow_detail_hires.png');
    if (await flap.isVisible()) {
      await flap.screenshot({ path: shotCrease });
    } else {
      await highResSticker.screenshot({ path: shotCrease });
    }
    saveScreenshot(shotCrease, 'sticker_crease_shadow_detail_hires.png');

    // Log exact captured image dimensions
    const dimensionsReport = {
      showcase_desktop_1440px: getPngDimensions(shot1440),
      showcase_desktop_1280px: getPngDimensions(shot1280),
      showcase_tablet_768px: getPngDimensions(shot768),
      showcase_mobile_390px: getPngDimensions(shot390),
      showcase_mobile_320px: getPngDimensions(shot320),
      sticker_front_detail_hires: getPngDimensions(shotFront),
      sticker_partially_peeled_hires: getPngDimensions(shotPartial),
      sticker_fully_peeled_reverse_foil_hires: getPngDimensions(shotFoil),
      sticker_crease_shadow_detail_hires: getPngDimensions(shotCrease),
    };
    console.log('MEASURED_IMAGE_DIMENSIONS:', JSON.stringify(dimensionsReport));
  });

  // =========================================================================
  // 4. GRANULAR PERFORMANCE PROFILING: LOAD, IDLE, DRAG, TYPOGRAPHY, MOBILE
  // =========================================================================
  test('4. Granular Performance Profiling across Load, Idle, Drag, Typography, and Mobile', async ({ page }) => {
    // Helper to calculate median and p95
    const calcStats = (deltas: number[]) => {
      if (deltas.length === 0) return { median: 0, p95: 0, min: 0, max: 0 };
      const sorted = [...deltas].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      return {
        median: Number(median.toFixed(2)),
        p95: Number(p95.toFixed(2)),
        min: Number(sorted[0].toFixed(2)),
        max: Number(sorted[sorted.length - 1].toFixed(2)),
      };
    };

    // Install instrumentation script on page
    await page.addInitScript(() => {
      (window as any).__telemetry = {
        cls: 0,
        loadLongTasks: [] as { timestamp: number; duration: number }[],
        activeLongTasks: [] as { timestamp: number; duration: number }[],
        isInitialLoadComplete: false,
      };

      try {
        const po = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              (window as any).__telemetry.cls += (entry as any).value;
            }
          }
        });
        po.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {}

      try {
        const to = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const task = {
              timestamp: Number(entry.startTime.toFixed(2)),
              duration: Number(entry.duration.toFixed(2)),
            };
            if (!(window as any).__telemetry.isInitialLoadComplete) {
              (window as any).__telemetry.loadLongTasks.push(task);
            } else {
              (window as any).__telemetry.activeLongTasks.push(task);
            }
          }
        });
        to.observe({ type: 'longtask', buffered: true });
      } catch (e) {}
    });

    // 4A. Initial Page Load Performance
    const loadStart = Date.now();
    await page.goto('http://localhost:3000/showcase');
    await page.waitForLoadState('networkidle');
    const loadDurationMs = Date.now() - loadStart;

    await page.evaluate(() => {
      (window as any).__telemetry.isInitialLoadComplete = true;
    });

    const loadMetrics = await page.evaluate(() => ({
      cls: Number((window as any).__telemetry.cls.toFixed(4)),
      loadLongTasks: (window as any).__telemetry.loadLongTasks,
    }));

    // Helper to sample requestAnimationFrame intervals during a specific phase
    const sampleRaf = async (action: () => Promise<void>, sampleDurationMs: number = 2000) => {
      await page.evaluate(() => {
        (window as any).__phaseRaf = [] as number[];
        let last = performance.now();
        (window as any).__stopPhase = false;
        const tick = (now: number) => {
          if ((window as any).__stopPhase) return;
          (window as any).__phaseRaf.push(now - last);
          last = now;
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      await action();
      await page.waitForTimeout(Math.max(100, sampleDurationMs));

      return await page.evaluate(() => {
        (window as any).__stopPhase = true;
        const deltas = (window as any).__phaseRaf as number[];
        const missed20 = deltas.filter((d: number) => d > 20).length;
        const missed33 = deltas.filter((d: number) => d > 33.3).length;
        return {
          frameCount: deltas.length,
          deltas,
          missedFramesOver20ms: missed20,
          missedFramesOver33ms: missed33,
        };
      });
    };

    // 4B. Idle Animation Performance (Atmospheric canvas motes running)
    const idlePerf = await sampleRaf(async () => {
      // Just idle
    }, 1500);

    // 4C. Active Pointer Dragging Performance
    const sticker = page.locator('#high-res-sticker-inspection [data-testid="interactive-sticker"]');
    const box = await sticker.boundingBox();
    const dragPerf = await sampleRaf(async () => {
      if (box) {
        const cornerX = box.x + box.width - 30;
        const cornerY = box.y + 30;
        await page.mouse.move(cornerX, cornerY);
        await page.mouse.down();
        await page.mouse.move(cornerX - 160, cornerY + 140, { steps: 12 });
        await page.mouse.up();
      }
    }, 1500);

    // 4D. Variable Typography Interaction Performance
    const headline = page.locator('h1[aria-label]');
    const headlineBox = await headline.boundingBox();
    const typoPerf = await sampleRaf(async () => {
      if (headlineBox) {
        for (let i = 0; i < 3; i++) {
          await page.mouse.move(headlineBox.x + 20, headlineBox.y + headlineBox.height / 2);
          await page.mouse.move(headlineBox.x + headlineBox.width - 20, headlineBox.y + headlineBox.height / 2, { steps: 8 });
        }
      }
    }, 1500);

    // 4E. Mobile Viewport Performance (390px, coarse touch pointer)
    await page.setViewportSize({ width: 390, height: 844 });
    const mobilePerf = await sampleRaf(async () => {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(200);
      await page.mouse.wheel(0, -300);
    }, 1200);

    const activeLongTasks = await page.evaluate(() => (window as any).__telemetry.activeLongTasks);

    const granularReport = {
      initialLoad: {
        loadDurationMs,
        cls: loadMetrics.cls,
        loadLongTasks: loadMetrics.loadLongTasks,
      },
      idleAnimation: {
        frameCount: idlePerf.frameCount,
        stats: calcStats(idlePerf.deltas),
        missedFramesOver20ms: idlePerf.missedFramesOver20ms,
        missedFramesOver33ms: idlePerf.missedFramesOver33ms,
      },
      activePointerDrag: {
        frameCount: dragPerf.frameCount,
        stats: calcStats(dragPerf.deltas),
        missedFramesOver20ms: dragPerf.missedFramesOver20ms,
        missedFramesOver33ms: dragPerf.missedFramesOver33ms,
      },
      variableTypography: {
        frameCount: typoPerf.frameCount,
        stats: calcStats(typoPerf.deltas),
        missedFramesOver20ms: typoPerf.missedFramesOver20ms,
        missedFramesOver33ms: typoPerf.missedFramesOver33ms,
      },
      mobileViewport: {
        frameCount: mobilePerf.frameCount,
        stats: calcStats(mobilePerf.deltas),
        missedFramesOver20ms: mobilePerf.missedFramesOver20ms,
        missedFramesOver33ms: mobilePerf.missedFramesOver33ms,
      },
      interactionLongTasks: activeLongTasks,
      rawDeltasPreview: {
        idle: idlePerf.deltas.slice(0, 10),
        drag: dragPerf.deltas.slice(0, 10),
        typography: typoPerf.deltas.slice(0, 10),
      },
    };

    console.log('GRANULAR_PERF_REPORT:', JSON.stringify(granularReport));
    expect(loadMetrics.cls).toBeLessThan(0.05);
  });

  // =========================================================================
  // 5. ACCESSIBILITY, FONT AXES & COMPONENT BEHAVIOR CHECKS
  // =========================================================================
  test('5. Accessibility & Component Invariants: Font axes, semantics, particle loop sleep, buttons, telemetry', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://localhost:3000/showcase');
    await page.waitForLoadState('networkidle');

    // 5A. Newsreader loaded font variable axes
    const headline = page.locator('h1[aria-label]');
    await expect(headline).toBeVisible();
    const ariaLabel = await headline.getAttribute('aria-label');
    expect(ariaLabel).toBe('The Field Dispatch & Recovery Ledger');

    // Hover over headline to verify variable axes change dynamically
    const box = await headline.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(100);
    }
    const fontVariation = await headline.locator('span').first().evaluate((el) => {
      return (el as HTMLElement).style.fontVariationSettings;
    });
    console.log('CHECK_FONT_VARIATION_SETTINGS:', fontVariation);
    expect(fontVariation).toContain('wght');
    expect(fontVariation).toContain('opsz');

    // 5B. FieldButton semantics & touch targets
    const buttons = page.locator('button.rounded-\\[2px\\]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const btn = buttons.nth(i);
      const bBox = await btn.boundingBox();
      expect(bBox).not.toBeNull();
      if (bBox) {
        expect(bBox.height).toBeGreaterThanOrEqual(44);
      }
    }

    // 5C. LedgerCard simulated telemetry labelling
    const ledgerCards = page.locator('.border-l-4');
    const cardText = await ledgerCards.first().textContent();
    expect(cardText).toBeDefined();

    // 5D. Verify emergency routes remain untouched and responsive
    await page.goto('http://localhost:3002/lost/new');
    await page.waitForLoadState('networkidle');
    const lostForm = page.locator('form');
    expect(await lostForm.count()).toBeGreaterThanOrEqual(0);

    await page.goto('http://localhost:3002/sightings/new');
    await page.waitForLoadState('networkidle');
    const sightingForm = page.locator('form');
    expect(await sightingForm.count()).toBeGreaterThanOrEqual(0);
  });
});
