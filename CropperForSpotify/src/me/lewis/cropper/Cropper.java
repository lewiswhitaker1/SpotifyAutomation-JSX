package me.lewis.cropper;

import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.File;
import javax.imageio.ImageIO;
import javax.swing.JFrame;
import javax.swing.JOptionPane;

public class Cropper {
    public static void main(String[] args) throws Exception {
        if (args.length != 1) {
            System.out.println("Usage: java ImageCropperExample <image-file>");
            System.exit(1);
        }
        File imageFile = new File(args[0]);
        if (!imageFile.exists()) {
            System.out.println("File not found: " + imageFile.getAbsolutePath());
            System.exit(1);
        }
        BufferedImage image = ImageIO.read(imageFile);
        ImageCropper cropper = new ImageCropper(image);
        JFrame frame = new JFrame("Image Cropper Example");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.add(cropper);
        frame.pack();
        frame.setVisible(true);
        // Wait for the user to crop the image
        Rectangle cropRect = null;
        while ((cropRect = cropper.getCropRect()) == null) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                // Ignore
            }
        }
        // Crop the image and save it to a file
        BufferedImage croppedImage = image.getSubimage(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
        String formatName = JOptionPane.showInputDialog(frame, "Enter image format (e.g., png, jpg, gif)");
        if (formatName != null) {
            File outputFile = new File(imageFile.getParentFile(), "cropped." + formatName);
            ImageIO.write(croppedImage, formatName, outputFile);
            System.out.println("Cropped image saved to " + outputFile.getAbsolutePath());
        }
        System.exit(0);
    }
}