package me.lewis.cropper;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

public class Cropper {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java ImageCropper <image file>");
            System.exit(1);
        }

        BufferedImage image = null;
        try {
            image = javax.imageio.ImageIO.read(new java.io.File(args[0]));
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(1);
        }

        ImageCropper cropper = new ImageCropper(image, true);
        javax.swing.JFrame frame = new javax.swing.JFrame("Image Cropper");
        frame.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
        frame.add(cropper);
        frame.pack();
        frame.setVisible(true);

        while (cropper.getCropRect() == null) {
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        Rectangle cropRect = cropper.getCropRect();
        BufferedImage croppedImage = image.getSubimage(cropRect.x, cropRect.y, cropRect.width, cropRect.height);

        javax.swing.JFrame croppedFrame = new javax.swing.JFrame("Cropped Image");
        javax.swing.JPanel croppedPanel = new javax.swing.JPanel() {
            public void paintComponent(Graphics g) {
                super.paintComponent(g);
                g.drawImage(croppedImage, 0, 0, null);
            }
        };
        croppedPanel.setPreferredSize(new Dimension(croppedImage.getWidth(), croppedImage.getHeight()));
        croppedFrame.setDefaultCloseOperation(javax.swing.JFrame.EXIT_ON_CLOSE);
        croppedFrame.add(croppedPanel);
        croppedFrame.pack();
        croppedFrame.setVisible(true);
    }
}