import { useState, useRef, useEffect } from "react";
import { Search, X, Folder, FileText } from "lucide-react";
import { useFileStore } from "../../store/useFileStore";
import { useFolderStore } from "../../store/useFolderStore";
import useSocket from "../../hooks/useSocket";
import SearchFileItem from "../files/SearchFileItem";
import SearchFolderItem from "../folders/SearchFolderItem";

export default function SearchBar({ isMobileTrigger = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const { files, getFiles } = useFileStore();
  const { folders, getFolders } = useFolderStore();

  useEffect(() => {
    getFiles();
    getFolders();
  }, [getFiles, getFolders]);

  useSocket({
    "file:list:updated": async () => {
      await getFiles();
      await getFolders();
    },
  });

  const q = query.trim().toLowerCase();

  const filteredFiles = files.filter(
    (f) => !f.isDeleted && f.name?.toLowerCase().includes(q),
  );

  const filteredFolders = folders.filter(
    (f) => !f.isDeleted && f.name?.toLowerCase().includes(q),
  );

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => e.key === "Escape" && close();
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const Results = () => (
    <div className="custom-scrollbar max-h-90 overflow-y-auto p-2">
      {filteredFolders.length > 0 && (
        <section>
          <Header
            icon={<Folder size={13} />}
            title="Folders"
            count={filteredFolders.length}
          />
          {filteredFolders.map((folder) => (
            <SearchFolderItem
              key={folder._id}
              folder={folder}
              onSelect={close}
            />
          ))}
        </section>
      )}

      {filteredFiles.length > 0 && (
        <section className="mt-2">
          <Header
            icon={<FileText size={13} />}
            title="Files"
            count={filteredFiles.length}
          />
          {filteredFiles.map((file) => (
            <SearchFileItem key={file._id} file={file} onSelect={close} />
          ))}
        </section>
      )}

      {!filteredFiles.length && !filteredFolders.length && (
        <div className="py-10 text-center">
          <Search size={20} className="mx-auto mb-2 text-neutral-600" />
          <p className="text-sm text-neutral-400">No results found</p>
          <p className="mt-1 text-xs text-neutral-600">
            Try another search term
          </p>
        </div>
      )}
    </div>
  );

  if (!isMobileTrigger) {
    return (
      <div ref={searchRef} className="relative w-full max-w-xl">
        <SearchInput
          query={query}
          setQuery={setQuery}
          inputRef={inputRef}
          onFocus={() => setOpen(true)}
          mobile={false}
        />

        {query && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0b0b0b] shadow-2xl">
            <div className="flex justify-between border-b border-neutral-800 px-4 py-3">
              <span className="text-xs text-neutral-400">Search results</span>
              <span className="text-xs text-neutral-600 px-2 py-0.5 bg-neutral-900 rounded-xl">
                {filteredFiles.length + filteredFolders.length}
              </span>
            </div>
            <Results />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white"
      >
        <Search size={19} />
      </button>

      {open && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={close}
          />

          <div
            ref={searchRef}
            className="relative border-b border-neutral-800 bg-[#080808] shadow-2xl"
          >
            <div className="p-4">
              <SearchInput
                query={query}
                setQuery={setQuery}
                inputRef={inputRef}
                onClose={close}
                mobile
              />
            </div>

            {query && (
              <div className="border-t border-neutral-900">
                <Results />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
      SEARCH INPUT
========================= */

function SearchInput({ query, setQuery, inputRef, onFocus, onClose, mobile }) {
  return (
    <div className="group flex h-10 items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 focus-within:border-neutral-600">
      <Search
        size={17}
        className="shrink-0 text-neutral-500 group-focus-within:text-neutral-300"
      />
      <input
        ref={inputRef}
        autoFocus={mobile}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        placeholder="Search files and folders..."
        className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-neutral-600"
      />
      {/* Keyboard Shortcut */}{" "}
      {!query && !mobile && (
        <div className="flex items-center gap-0.5 rounded-md border border-neutral-800 bg-neutral-950 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
          <span>⌘</span> <span>K</span>{" "}
        </div>
      )}
      {/* Clear */}{" "}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="text-neutral-500 hover:text-white"
          aria-label="Clear search"
        >
          <X size={15} />{" "}
        </button>
      )}
      {/* Mobile Close */}
      {mobile && (
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-white"
          aria-label="Close search"
        >
          <X size={17} />
        </button>
      )}{" "}
    </div>
  );
}

/* =========================
        SECTION HEADER
========================= */

function Header({ icon, title, count }) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
      {icon}
      <span>{title}</span>
      <span className="text-neutral-700">{count}</span>
    </div>
  );
}
