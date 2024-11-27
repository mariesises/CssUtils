<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if ($fileExtension === 'jpg' || $fileExtension === 'jpeg' || $fileExtension === 'png') {
            if ($fileExtension === 'jpg' || $fileExtension === 'jpeg') {
                $image = imagecreatefromjpeg($fileTmpPath);
            } elseif ($fileExtension === 'png') {
                $image = imagecreatefrompng($fileTmpPath);
            }

            $outputFile = 'uploads/' . pathinfo($fileName, PATHINFO_FILENAME) . '.webp';

            if (!is_dir('uploads')) {
                mkdir('uploads'); // Crear la carpeta si no existe
            }

            if (imagewebp($image, $outputFile)) {
                imagedestroy($image);
                echo "<h3>Imagen convertida exitosamente a formato WEBP:</h3>";
                echo "<a href='$outputFile' download>Descargar imagen WEBP</a><br>";
                echo "<img src='$outputFile' alt='Imagen convertida' style='max-width:300px;'>";
            } else {
                echo "<p>Error al convertir la imagen.</p>";
            }
        } else {
            echo "<p>Por favor, suba una imagen en formato JPG o PNG.</p>";
        }
    } else {
        echo "<p>Hubo un error al subir el archivo.</p>";
    }
}
