package me.lewis.cropper;

import javax.swing.*;
import java.awt.image.BufferedImage;

class ImageViewerFrame extends JFrame {
    public ImageViewerFrame(BufferedImage image) {
        super("Image Viewer");
        add(new ImagePanel(image));
    }
}