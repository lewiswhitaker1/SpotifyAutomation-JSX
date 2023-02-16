package me.lewis.cropper;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Rectangle;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.image.BufferedImage;
import javax.swing.JPanel;

public class ImageCropper extends JPanel {
    private static final int HANDLE_SIZE = 8;
    private BufferedImage image;
    private Rectangle cropRect;
    private Point dragStart;
    private boolean lockedRatio;
    private double aspectRatio = 1.0;

    public ImageCropper(BufferedImage image, boolean lockedRatio) {
        this.image = image;
        this.lockedRatio = lockedRatio;
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                dragStart = e.getPoint();
            }

            public void mouseReleased(MouseEvent e) {
                dragStart = null;
            }
        });
        addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                int x = Math.min(dragStart.x, e.getX());
                int y = Math.min(dragStart.y, e.getY());
                int width = Math.abs(dragStart.x - e.getX());
                int height = Math.abs(dragStart.y - e.getY());
                if (lockedRatio) {
                    if (width > height) {
                        height = (int) (width / aspectRatio);
                    } else {
                        width = (int) (height * aspectRatio);
                    }
                }
                cropRect = new Rectangle(x, y, width, height);
                repaint();
            }
        });
    }

    public Dimension getPreferredSize() {
        return new Dimension(image.getWidth(), image.getHeight());
    }

    public Rectangle getCropRect() {
        return cropRect;
    }

    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(image, 0, 0, null);
        if (cropRect != null) {
            g.setColor(new Color(0, 0, 0, 64));
            g.fillRect(0, 0, getWidth(), cropRect.y);
            g.fillRect(0, cropRect.y, cropRect.x, cropRect.height);
            g.fillRect(cropRect.x + cropRect.width, cropRect.y, getWidth() - cropRect.x - cropRect.width, cropRect.height);
            g.fillRect(0, cropRect.y + cropRect.height, getWidth(), getHeight() - cropRect.y - cropRect.height);
            g.setColor(Color.BLACK);
            g.drawRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
            if (lockedRatio) {
                int handleSize = HANDLE_SIZE * 2;
                int handleX = cropRect.x + cropRect.width - HANDLE_SIZE;
                int handleY = cropRect.y + cropRect.height - HANDLE_SIZE;
                g.fillRect(handleX, handleY, handleSize, handleSize);
            } else {
                g.fillRect(cropRect.x, cropRect.y, HANDLE_SIZE, HANDLE_SIZE);
                g.fillRect(cropRect.x + cropRect.width - HANDLE_SIZE, cropRect.y, HANDLE_SIZE, HANDLE_SIZE);
                g.fillRect(cropRect.x, cropRect.y + cropRect.height - HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
                g.fillRect(cropRect.x + cropRect.width - HANDLE_SIZE, cropRect.y + cropRect.height - HANDLE_SIZE, HANDLE_SIZE, HANDLE_SIZE);
            }
        }
    }

    public void setAspectRatio(double aspectRatio) {
        this.aspectRatio = aspectRatio;
        if (lockedRatio && cropRect != null) {
            int width = cropRect.width;
            int height = (int) (width / aspectRatio);
            if (cropRect.width > cropRect.height) {
                cropRect.height = height;
            } else {
                cropRect.width = width;
            }
            repaint();
        }
    }
}