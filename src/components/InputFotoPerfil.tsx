import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

interface Props {
  fotoActual?: string | null;
  iniciales: string;
  onChange: (file: File | undefined) => void;
}

export function InputFotoPerfil({ fotoActual, iniciales, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) {
      return;
    }

    // Validar que el archivo sea una imagen.
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen");
      return;
    }

    // Validar que no supere los 5 MB.
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es muy grande, no debe superar los 5 MB");
      return;
    }

    // Crear una URL temporal para la previsualización local.
    setPreview(URL.createObjectURL(file));

    // Comunicar el archivo seleccionado al componente padre.
    onChange(file);
  };

  const quitarSeleccion = () => {
    setPreview(null);
    onChange(undefined);
  };

  const imagenMostrada = preview ?? fotoActual;

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="cursor-pointer group relative inline-block">
        <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-emerald-600 shadow-md bg-emerald-100">
          {imagenMostrada ? (
            <img
              src={imagenMostrada}
              alt="Avatar de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center text-2xl font-bold text-emerald-800">
              {iniciales}
            </span>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              Cambiar foto
            </span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {preview && (
        <button
          type="button"
          onClick={quitarSeleccion}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
        >
          Quitar foto
        </button>
      )}
    </div>
  );
}
