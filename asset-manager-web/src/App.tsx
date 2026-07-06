import { FormEvent, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Asset = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string | null;
  status: string;
  fileSize: number;
  originalFileName: string;
  fileUrl: string;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
};

type ExportedFile = {
  id: string;
  assetId: string;
  format: string;
  profile?: string | null;
  fileName: string;
  fileSize: number;
  status: string;
  createdAt: string;
  downloadUrl?: string;
};

type ViewerSettings = {
  exposure: number;
  shadowIntensity: number;
  fieldOfView: number;
  autoRotate: boolean;
};

type ExportOptions = {
  format: string;
  profile: string;
  quality: number;
  textureSize: number;
  simplifyRatio: number;
  dracoCompression: boolean;
};

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [exportsList, setExportsList] = useState<ExportedFile[]>([]);
  const [message, setMessage] = useState("");

  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    status: "AVAILABLE"
  });

  const [viewerSettings, setViewerSettings] = useState<ViewerSettings>({
    exposure: 1,
    shadowIntensity: 1,
    fieldOfView: 45,
    autoRotate: false
  });

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "gltf",
    profile: "web-optimized",
    quality: 80,
    textureSize: 1024,
    simplifyRatio: 0.75,
    dracoCompression: true
  });

  async function loadAssets() {
    const response = await fetch(`${API_URL}/api/assets`);
    const data = await response.json();
    setAssets(data);
  }

  async function loadExports(assetId: string) {
    const response = await fetch(`${API_URL}/api/assets/${assetId}/exports`);

    if (!response.ok) {
      setExportsList([]);
      return;
    }

    const data = await response.json();
    setExportsList(data);
  }

  function selectAsset(asset: Asset) {
    setSelectedAsset(asset);
    setEditForm({
      name: asset.name,
      description: asset.description || "",
      category: asset.category || "",
      tags: asset.tags || "",
      status: asset.status
    });
    loadExports(asset.id);
  }

  async function handleUpload(event: FormEvent) {
    event.preventDefault();

    if (!selectedFile) {
      setMessage("Selecione um arquivo .glb.");
      return;
    }

    const formData = new FormData();
    formData.append("name", uploadForm.name);
    formData.append("description", uploadForm.description);
    formData.append("category", uploadForm.category);
    formData.append("tags", uploadForm.tags);
    formData.append("file", selectedFile);

    const response = await fetch(`${API_URL}/api/assets`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      setMessage("Erro ao cadastrar asset.");
      return;
    }

    setMessage("Asset cadastrado com sucesso.");
    setUploadForm({
      name: "",
      description: "",
      category: "",
      tags: ""
    });
    setSelectedFile(null);
    await loadAssets();
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();

    if (!selectedAsset) return;

    const response = await fetch(`${API_URL}/api/assets/${selectedAsset.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editForm)
    });

    if (!response.ok) {
      setMessage("Erro ao atualizar asset.");
      return;
    }

    const updatedAsset = await response.json();
    setSelectedAsset(updatedAsset);
    setMessage("Asset atualizado com sucesso.");
    await loadAssets();
  }

  async function handleDelete() {
    if (!selectedAsset) return;

    const response = await fetch(`${API_URL}/api/assets/${selectedAsset.id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setMessage("Erro ao excluir asset.");
      return;
    }

    setSelectedAsset(null);
    setExportsList([]);
    setMessage("Asset excluído com sucesso.");
    await loadAssets();
  }

  async function handleExport(event: FormEvent) {
    event.preventDefault();

    if (!selectedAsset) return;

    const body = {
      ...exportOptions,
      rotation: {
        x: 0,
        y: 90,
        z: 0
      },
      scale: 1,
      camera: {
        fieldOfView: viewerSettings.fieldOfView,
        zoom: 1
      },
      lighting: {
        exposure: viewerSettings.exposure,
        intensity: viewerSettings.shadowIntensity,
        environment: "studio"
      }
    };

    const response = await fetch(`${API_URL}/api/assets/${selectedAsset.id}/exports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Erro ao exportar asset.");
      return;
    }

    setMessage("Exportação criada com sucesso.");
    await loadExports(selectedAsset.id);
  }

  function downloadOriginal() {
    if (!selectedAsset) return;
    window.open(`${API_URL}${selectedAsset.downloadUrl}`, "_blank");
  }

  function downloadExported(exportedFile: ExportedFile) {
    const url =
      exportedFile.downloadUrl ||
      `/api/assets/${exportedFile.assetId}/exports/${exportedFile.id}/download`;

    window.open(`${API_URL}${url}`, "_blank");
  }

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1>Asset Manager 3D</h1>
          <p>Upload, visualização, edição, download e exportação de assets GLB.</p>
        </div>
        <a href={`${API_URL}/api-docs`} target="_blank">
          Abrir Swagger
        </a>
      </header>

      {message && <div className="message">{message}</div>}

      <section className="grid">
        <aside className="panel">
          <h2>Cadastrar asset</h2>

          <form onSubmit={handleUpload} className="form">
            <input
              placeholder="Nome"
              value={uploadForm.name}
              onChange={event => setUploadForm({ ...uploadForm, name: event.target.value })}
              required
            />

            <input
              placeholder="Descrição"
              value={uploadForm.description}
              onChange={event => setUploadForm({ ...uploadForm, description: event.target.value })}
            />

            <input
              placeholder="Categoria"
              value={uploadForm.category}
              onChange={event => setUploadForm({ ...uploadForm, category: event.target.value })}
            />

            <input
              placeholder="Tags"
              value={uploadForm.tags}
              onChange={event => setUploadForm({ ...uploadForm, tags: event.target.value })}
            />

            <input
              type="file"
              accept=".glb"
              onChange={event => setSelectedFile(event.target.files?.[0] || null)}
              required
            />

            <button type="submit">Cadastrar</button>
          </form>

          <h2>Assets cadastrados</h2>

          <div className="asset-list">
            {assets.map(asset => (
              <button
                key={asset.id}
                className={selectedAsset?.id === asset.id ? "asset-card active" : "asset-card"}
                onClick={() => selectAsset(asset)}
              >
                <strong>{asset.name}</strong>
                <span>{asset.category || "Sem categoria"}</span>
                <small>{asset.originalFileName}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="viewer-area">
          {!selectedAsset && (
            <div className="empty">
              Selecione um asset para visualizar.
            </div>
          )}

          {selectedAsset && (
            <>
              <div className="viewer-card">
                <model-viewer
                  src={`${API_URL}${selectedAsset.fileUrl}`}
                  alt={selectedAsset.name}
                  camera-controls
                  auto-rotate={viewerSettings.autoRotate}
                  exposure={String(viewerSettings.exposure)}
                  shadow-intensity={String(viewerSettings.shadowIntensity)}
                  field-of-view={`${viewerSettings.fieldOfView}deg`}
                  environment-image="neutral"
                  style={{ width: "100%", height: "520px", background: "#f4f4f5" }}
                ></model-viewer>
              </div>

              <div className="details">
                <div>
                  <h2>{selectedAsset.name}</h2>
                  <p>{selectedAsset.description || "Sem descrição"}</p>
                  <p><strong>Status:</strong> {selectedAsset.status}</p>
                  <p><strong>Arquivo:</strong> {selectedAsset.originalFileName}</p>
                  <p><strong>Tamanho:</strong> {(selectedAsset.fileSize / 1024).toFixed(2)} KB</p>
                </div>

                <button onClick={downloadOriginal}>Baixar original</button>
              </div>

              <section className="controls">
                <h3>Visualização</h3>

                <label>
                  Exposição
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={viewerSettings.exposure}
                    onChange={event =>
                      setViewerSettings({
                        ...viewerSettings,
                        exposure: Number(event.target.value)
                      })
                    }
                  />
                </label>

                <label>
                  Intensidade de sombra/luz
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={viewerSettings.shadowIntensity}
                    onChange={event =>
                      setViewerSettings({
                        ...viewerSettings,
                        shadowIntensity: Number(event.target.value)
                      })
                    }
                  />
                </label>

                <label>
                  Campo de visão / zoom
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="1"
                    value={viewerSettings.fieldOfView}
                    onChange={event =>
                      setViewerSettings({
                        ...viewerSettings,
                        fieldOfView: Number(event.target.value)
                      })
                    }
                  />
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={viewerSettings.autoRotate}
                    onChange={event =>
                      setViewerSettings({
                        ...viewerSettings,
                        autoRotate: event.target.checked
                      })
                    }
                  />
                  Rotação automática
                </label>
              </section>

              <section className="two-columns">
                <form onSubmit={handleUpdate} className="panel">
                  <h3>Editar asset</h3>

                  <input
                    placeholder="Nome"
                    value={editForm.name}
                    onChange={event => setEditForm({ ...editForm, name: event.target.value })}
                    required
                  />

                  <input
                    placeholder="Descrição"
                    value={editForm.description}
                    onChange={event => setEditForm({ ...editForm, description: event.target.value })}
                  />

                  <input
                    placeholder="Categoria"
                    value={editForm.category}
                    onChange={event => setEditForm({ ...editForm, category: event.target.value })}
                  />

                  <input
                    placeholder="Tags"
                    value={editForm.tags}
                    onChange={event => setEditForm({ ...editForm, tags: event.target.value })}
                  />

                  <select
                    value={editForm.status}
                    onChange={event => setEditForm({ ...editForm, status: event.target.value })}
                  >
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ERROR">ERROR</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button type="submit">Salvar alterações</button>
                  <button type="button" className="danger" onClick={handleDelete}>
                    Excluir asset
                  </button>
                </form>

                <form onSubmit={handleExport} className="panel">
                  <h3>Exportar asset</h3>

                  <select
                    value={exportOptions.format}
                    onChange={event =>
                      setExportOptions({ ...exportOptions, format: event.target.value })
                    }
                  >
                    <option value="gltf">GLTF</option>
                    <option value="glb">GLB</option>
                    <option value="optimized-glb">GLB otimizado</option>
                    <option value="fbx">FBX</option>
                    <option value="usd">USD</option>
                    <option value="usda">USDA</option>
                    <option value="usdc">USDC</option>
                    <option value="datasmith">Datasmith</option>
                  </select>

                  <select
                    value={exportOptions.profile}
                    onChange={event =>
                      setExportOptions({ ...exportOptions, profile: event.target.value })
                    }
                  >
                    <option value="web-optimized">Web optimized</option>
                    <option value="high-quality">High quality</option>
                    <option value="editable">Editable</option>
                  </select>

                  <label>
                    Qualidade: {exportOptions.quality}
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={exportOptions.quality}
                      onChange={event =>
                        setExportOptions({
                          ...exportOptions,
                          quality: Number(event.target.value)
                        })
                      }
                    />
                  </label>

                  <label>
                    Tamanho de textura
                    <select
                      value={exportOptions.textureSize}
                      onChange={event =>
                        setExportOptions({
                          ...exportOptions,
                          textureSize: Number(event.target.value)
                        })
                      }
                    >
                      <option value={512}>512</option>
                      <option value={1024}>1024</option>
                      <option value={2048}>2048</option>
                      <option value={4096}>4096</option>
                    </select>
                  </label>

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={exportOptions.dracoCompression}
                      onChange={event =>
                        setExportOptions({
                          ...exportOptions,
                          dracoCompression: event.target.checked
                        })
                      }
                    />
                    Compressão Draco
                  </label>

                  <button type="submit">Exportar</button>
                </form>
              </section>

              <section className="panel">
                <h3>Exportações</h3>

                {exportsList.length === 0 && <p>Nenhuma exportação criada.</p>}

                {exportsList.map(item => (
                  <div key={item.id} className="export-card">
                    <div>
                      <strong>{item.fileName}</strong>
                      <span>{item.format} • {item.profile || "sem perfil"} • {item.status}</span>
                    </div>
                    <button onClick={() => downloadExported(item)}>
                      Baixar
                    </button>
                  </div>
                ))}
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
