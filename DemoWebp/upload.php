<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['images'])) {
        $totalFiles = count($_FILES['images']['name']);
        if ($totalFiles > 60) {
            echo "<p>Por favor, suba hasta un máximo de 60 imágenes en formato JPG o PNG.</p>";
            exit;
        }

        $zip = new ZipArchive();
        $zipFileName = 'uploads/converted_images.zip';

        if (!is_dir('uploads')) {
            mkdir('uploads'); // Crear la carpeta si no existe
        }

        if ($zip->open($zipFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            exit("No se pudo crear el archivo ZIP.");
        }

        $convertedCount = 0;

        foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
            if ($_FILES['images']['error'][$key] !== UPLOAD_ERR_OK) {
                continue; // Saltar archivos con error
            }

            $fileName = $_FILES['images']['name'][$key];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if ($fileExtension === 'jpg' || $fileExtension === 'jpeg' || $fileExtension === 'png') {
                if ($fileExtension === 'jpg' || $fileExtension === 'jpeg') {
                    $image = imagecreatefromjpeg($tmpName);
                } elseif ($fileExtension === 'png') {
                    $image = imagecreatefrompng($tmpName);
                }

                if ($image) {
                    $outputFile = 'uploads/' . pathinfo($fileName, PATHINFO_FILENAME) . '.webp';

                    if (imagewebp($image, $outputFile)) {
                        imagedestroy($image);
                        $zip->addFile($outputFile, basename($outputFile));
                        $convertedCount++;
                    }
                }
            }
        }

        $zip->close();

        if ($convertedCount > 0) {
            echo "<h3>Imágenes convertidas exitosamente a formato WEBP:</h3>";
            echo "<a id='downloadLink' href='$zipFileName' download>Descargar todas las imágenes en un archivo ZIP</a><br>";
        } else {
            echo "<p>No se pudieron convertir las imágenes. Por favor, verifique los formatos y vuelva a intentarlo.</p>";
        }
    } else {
        echo "<p>Hubo un problema al subir los archivos. Por favor, intente nuevamente.</p>";
    }
}
