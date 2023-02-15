package me.lewis.cropper;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JPanel;

public class ImageWindow extends JPanel {

    private Image image;

    public ImageWindow(Image image) {
        this.image = image;
        setPreferredSize(new Dimension(image.getWidth(null), image.getHeight(null)));
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.drawImage(image, 0, 0, null);
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