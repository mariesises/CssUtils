<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['images']) && count($_FILES['images']['name']) <= 60) {
        $zip = new ZipArchive();
        $zipFileName = 'uploads/converted_images.zip';

        if (!is_dir('uploads')) {
            mkdir('uploads'); // Crear la carpeta si no existe
        }

        if ($zip->open($zipFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            exit("No se pudo crear el archivo ZIP.");
        }

        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            $fileName = $_FILES['images']['name'][$key];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if ($fileExtension === 'jpg' || $fileExtension === 'jpeg' || $fileExtension === 'png') {
                if ($fileExtension === 'jpg' || $fileExtension === 'jpeg') {
                    $image = imagecreatefromjpeg($tmpName);
                } elseif ($fileExtension === 'png') {
                    $image = imagecreatefrompng($tmpName);
                }

                $outputFile = 'uploads/' . pathinfo($fileName, PATHINFO_FILENAME) . '.webp';

                if (imagewebp($image, $outputFile)) {
                    imagedestroy($image);
                    $zip->addFile($outputFile, basename($outputFile));
                }
            }
        }

        $zip->close();

        echo "<h3>Imágenes convertidas exitosamente a formato WEBP:</h3>";
        echo "<a href='$zipFileName' download>Descargar todas las imágenes en un archivo ZIP</a><br>";
    } else {
        echo "<p>Por favor, suba hasta un máximo de 60 imágenes en formato JPG o PNG.</p>";
    }
}
