import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Canvas,
  Image as SkiaImage,
  ImageFormat,
  Path,
  Skia,
  SkPath,
  useCanvasRef,
  useImage,
} from '@shopify/react-native-skia';

export type DrawingTool = 'pen' | 'eraser';

export interface DrawingCanvasHandle {
  clear: () => void;
  loadBackground: (url: string | null) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setTool: (tool: DrawingTool) => void;
  capturePng: () => Uint8Array | null;
}

interface StrokePath {
  path: SkPath;
  color: string;
  strokeWidth: number;
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  disabled?: boolean;
}

const BACKGROUND_COLOR = '#ffffff';

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  function DrawingCanvasImpl({ width, height, disabled = false }, ref) {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<StrokePath[]>([]);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const backgroundImage = useImage(backgroundUrl);

    const colorRef = useRef('#232320');
    const widthRef = useRef(6);
    const toolRef = useRef<DrawingTool>('pen');
    const currentPathRef = useRef<SkPath | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        clear() {
          currentPathRef.current = null;
          setPaths([]);
          setBackgroundUrl(null);
        },
        loadBackground(url) {
          currentPathRef.current = null;
          setPaths([]);
          setBackgroundUrl(url);
        },
        setColor(color) {
          colorRef.current = color;
        },
        setStrokeWidth(w) {
          widthRef.current = w;
        },
        setTool(tool) {
          toolRef.current = tool;
        },
        capturePng() {
          const image = canvasRef.current?.makeImageSnapshot();
          if (!image) return null;
          return image.encodeToBytes(ImageFormat.PNG, 100);
        },
      }),
      [canvasRef]
    );

    const strokeColorFor = (tool: DrawingTool) => (tool === 'eraser' ? BACKGROUND_COLOR : colorRef.current);
    const strokeWidthFor = (tool: DrawingTool) => (tool === 'eraser' ? widthRef.current * 3 : widthRef.current);

    const panGesture = Gesture.Pan()
      .runOnJS(true)
      .minDistance(0)
      .enabled(!disabled)
      .onBegin((e) => {
        const tool = toolRef.current;
        const newPath = Skia.Path.Make();
        newPath.moveTo(e.x, e.y);
        newPath.lineTo(e.x + 0.01, e.y + 0.01);
        currentPathRef.current = newPath;
        setPaths((prev) => [
          ...prev,
          { path: newPath, color: strokeColorFor(tool), strokeWidth: strokeWidthFor(tool) },
        ]);
      })
      .onUpdate((e) => {
        const current = currentPathRef.current;
        if (!current) return;
        current.lineTo(e.x, e.y);
        setPaths((prev) => [...prev]);
      })
      .onFinalize(() => {
        currentPathRef.current = null;
      });

    return (
      <GestureDetector gesture={panGesture}>
        <View collapsable={false} style={{ width, height, backgroundColor: BACKGROUND_COLOR }}>
          <Canvas ref={canvasRef} style={{ width, height }}>
            {backgroundImage ? (
              <SkiaImage image={backgroundImage} x={0} y={0} width={width} height={height} fit="cover" />
            ) : null}
            {paths.map((item, index) => (
              <Path
                key={index}
                path={item.path}
                color={item.color}
                style="stroke"
                strokeWidth={item.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
          </Canvas>
        </View>
      </GestureDetector>
    );
  }
);
