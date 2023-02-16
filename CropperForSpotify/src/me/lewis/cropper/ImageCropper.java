package me.lewis.cropper;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.*;
import javax.swing.*;

public class ImageCropper extends JPanel {
    private BufferedImage image;
    private Rectangle cropRect;

    public ImageCropper(BufferedImage image) {
        this.image = image;
        addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                cropRect = new Rectangle(e.getPoint());
                repaint();
            }

            public void mouseReleased(MouseEvent e) {
                cropRect = null;
                repaint();
            }
        });
        addMouseMotionListener(new MouseAdapter() {
            public void mouseDragged(MouseEvent e) {
                int x = cropRect.x;
                int y = cropRect.y;
                int width = e.getX() - x;
                int height = e.getY() - y;
                cropRect.setRect(x, y, width, height);
                repaint();
            }
        });
    }

    public Rectangle getCropRect() {
        return cropRect;
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(image, 0, 0, this);

        if (cropRect != null) {
            Graphics2D g2d = (Graphics2D) g.create();
            g2d.setColor(new Color(0, 0, 0, 128));
            g2d.fill(getBounds());
            g2d.setColor(Color.WHITE);
            g2d.draw(cropRect);
            g2d.dispose();
        }
    }
}
