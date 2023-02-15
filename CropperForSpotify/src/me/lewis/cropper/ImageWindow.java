package me.lewis.cropper;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Rectangle;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.event.MouseInputAdapter;

public class ImageWindow extends JPanel {

    private Image image;
    private Rectangle cropRect;

    public ImageWindow(Image image) {
        this.image = image;
        setPreferredSize(new Dimension(image.getWidth(null), image.getHeight(null)));
        addMouseListener(new CropMouseListener());
        addMouseMotionListener(new CropMouseListener());
        // Initialize crop rectangle to center of the window
        int cropSize = Math.min(image.getWidth(null), image.getHeight(null)) / 2;
        int cropX = (image.getWidth(null) - cropSize) / 2;
        int cropY = (image.getHeight(null) - cropSize) / 2;
        cropRect = new Rectangle(cropX, cropY, cropSize, cropSize);
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        // Draw the image
        g.drawImage(image, 0, 0, null);
        // Draw the crop rectangle
        g.drawRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
    }

    private class CropMouseListener extends MouseInputAdapter {

        private int startX, startY;

        @Override
        public void mousePressed(java.awt.event.MouseEvent e) {
            startX = e.getX();
            startY = e.getY();
        }

        @Override
        public void mouseDragged(java.awt.event.MouseEvent e) {
            // Calculate the new crop rectangle based on the mouse position
            int dx = e.getX() - startX;
            int dy = e.getY() - startY;
            int cropSize = Math.min(image.getWidth(null), image.getHeight(null));
            int cropX = cropRect.x + dx;
            int cropY = cropRect.y + dy;
            cropRect = new Rectangle(cropX, cropY, cropSize, cropSize);
            // Force the crop rectangle to be square
            if (cropRect.x < 0) {
                cropRect.x = 0;
            }
            if (cropRect.y < 0) {
                cropRect.y = 0;
            }
            if (cropRect.x + cropRect.width > image.getWidth(null)) {
                cropRect.x = image.getWidth(null) - cropRect.width;
            }
            if (cropRect.y + cropRect.height > image.getHeight(null)) {
                cropRect.y = image.getHeight(null) - cropRect.height;
            }
            repaint();
        }

    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: java ImageWindow <image_file>");
            System.exit(1);
        }

        try {
            BufferedImage image = ImageIO.read(new File(args[0]));
            JFrame frame = new JFrame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setContentPane(new ImageWindow(image));
            frame.pack();
            // Center the window on the screen
            Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
            frame.setLocation((screen.width - frame.getWidth()) / 2, (screen.height - frame.getHeight()) / 2);
            frame.setVisible(true);
        } catch (Exception e) {
            System.err.println("Error: " + e);
            System.exit(1);
        }
    }

}