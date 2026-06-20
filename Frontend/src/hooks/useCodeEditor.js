import { useState, useEffect, useRef } from "react";
import socket from "../socket/socket";
import { runCode } from "../services/codeService";
import { fixCode, generateCode } from "../services/aiService";
import toast from "react-hot-toast";
import axios from "axios";

export const useCodeEditor = (roomId, username, language = "") => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [showRunCode, setShowRunCode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isFix, setisFix] = useState(false)
  const [codingUsers, setCodingUsers] = useState({});
  const editorRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  const codingTimeoutRef = useRef({});
  const stopCodingTimerRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const loadRoom = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCode(res.data.codeContent);
        
      } catch (error) {
        // console.error("Failed to load room data:", error);
      }
    };

    loadRoom();

    // Set up socket listener for code updates
    const handleCodeUpdate = (updatedCode) => {
      setCode(updatedCode);
    };

    const handleUserCodeTyping = ({ userId: codingUserId, isCoding, username: codingUsername }) => {
      if (isCoding) {
        setCodingUsers((prev) => ({ ...prev, [codingUserId]: codingUsername }));
        if (codingTimeoutRef.current[codingUserId]) {
          clearTimeout(codingTimeoutRef.current[codingUserId]);
        }
        codingTimeoutRef.current[codingUserId] = setTimeout(() => {
          setCodingUsers((prev) => {
            const next = { ...prev };
            delete next[codingUserId];
            return next;
          });
        }, 1500);
      } else {
        setCodingUsers((prev) => {
          const next = { ...prev };
          delete next[codingUserId];
          return next;
        });
        if (codingTimeoutRef.current[codingUserId]) {
          clearTimeout(codingTimeoutRef.current[codingUserId]);
          delete codingTimeoutRef.current[codingUserId];
        }
      }
    };

    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("userCodeTyping", handleUserCodeTyping);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("userCodeTyping", handleUserCodeTyping);
      Object.values(codingTimeoutRef.current).forEach(clearTimeout);
      if (stopCodingTimerRef.current) clearTimeout(stopCodingTimerRef.current);
    };
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });

    const name = username || "Someone";
    socket.emit("codeTyping", { roomId, isCoding: true, username: name });

    if (stopCodingTimerRef.current) clearTimeout(stopCodingTimerRef.current);
    stopCodingTimerRef.current = setTimeout(() => {
      socket.emit("codeTyping", { roomId, isCoding: false, username: name });
    }, 1500);
  };

  const handleRunCode = async (language) => {
    setOutput("Running...");
    setShowRunCode(true);
    
    try {
      const result = await runCode(code, language);
      setOutput(
        result.compile_output ||
        result.stderr ||
        result.stdout ||
        result.message ||
        "No output"
      );
    } catch (error) {
      const backendMessage =
        error?.response?.data?.error?.stderr ||
        error?.response?.data?.error?.compile_output ||
        error?.response?.data?.message;
      setOutput(backendMessage || "Error running code.");
    }
  };

  const handleFixCode = async () => {
    if (code.trim() === "") {
      toast.error("You need to write code in the editor first");
      return;
    }
    
    try {
      const result = await fixCode(code);
      setCode(result.fixCode);
      setisFix((prevIsFix) => !prevIsFix);
      toast.success("Code fixed successfully");
    } catch (error) {
      toast.error("Failed to fix code");
      // console.error(error);
    }
  };

  const handleGenerateCode = async () => {
    if (prompt.trim() === "") {
      toast.error("Please enter a prompt first");
      return;
    }
    
    try {
      const result = await generateCode(prompt);
      setCode(result.generatedCode);
      setIsPromptOpen(false);
      setPrompt("");
      toast.success("Code generated successfully");
    } catch (error) {
      toast.error("Failed to generate code");
      // console.error(error);
    }
  };

  const onEditorMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return {
    code,
    setCode,
    output,
    showRunCode,
    setShowRunCode,
    prompt,
    setPrompt,
    isPromptOpen,
    setIsPromptOpen,
    editorRef,
    handleCodeChange,
    handleRunCode,
    handleFixCode,
    handleGenerateCode,
    onEditorMount,
    isFix,
    setisFix,
    codingUsers
  };
};
