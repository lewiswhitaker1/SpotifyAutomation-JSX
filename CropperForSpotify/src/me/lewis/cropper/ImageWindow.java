package me.lewis.cropper;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Point;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JPanel;

public class ImageWindow extends JPanel {

    private Image image;
    private Point topLeft;
    private int cropSize;

    public ImageWindow(Image image) {
        this.image = image;
        setPreferredSize(new Dimension(image.getWidth(null), image.getHeight(null)));
        topLeft = new Point(0, 0);
        cropSize = Math.min(image.getWidth(null), image.getHeight(null));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(image, 0, 0, null);
        // Draw crop box
        g.setColor(Color.RED);
        g.drawRect(topLeft.x, topLeft.y, cropSize, cropSize);
        g.setColor(Color.BLUE);
        g.fillRect(topLeft.x - 2, topLeft.y - 2, 5, 5);
        g.fillRect(topLeft.x + cropSize - 3, topLeft.y - 2, 5, 5);
        g.fillRect(topLeft.x - 2, topLeft.y + cropSize - 3, 5, 5);
        g.fillRect(topLeft.x + cropSize - 3, topLeft.y + cropSize - 3, 5, 5);
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
            System.err.println("Error: " + e.getMessage());
            System.exit(1);
        }
    }
}