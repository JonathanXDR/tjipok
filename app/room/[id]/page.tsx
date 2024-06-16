"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ConnectToJira } from "./ConnectToJira";
import { useEffect, useState } from "react";
import { JiraProjects } from "./JiraProjects";
import { JiraBoards } from "./JiraBoards";
import { JiraSprints } from "./JiraSprints";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RoomPage(props: { params: { id: string } }) {
  const [token, setToken] = useState("");
  const [cloudId, setCloudId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [boardId, setBoardId] = useState("");
  const [roomData, setRoomData] = useState(null);

  function setJira(storage: string) {
    try {
      const jira = JSON.parse(storage);
      setToken(jira.auth.access_token);
      setCloudId(jira.site[0].id);
    } catch {
      setToken("");
      setCloudId("");
    }
  }

  useEffect(() => {
    const storage = localStorage.getItem("jira");
    if (storage) setJira(storage);

    function storageListener(e: StorageEvent) {
      const storage = e.storageArea?.getItem("jira");

      if (storage) {
        setJira(storage);
      } else {
        setToken("");
        setCloudId("");
      }
    }

    window.addEventListener("storage", storageListener);

    const roomSubscription = supabase
      .from(`rooms:id=eq.${props.params.id}`)
      .on('UPDATE', payload => {
        setRoomData(payload.new);
      })
      .subscribe();

    return () => {
      window.removeEventListener("storage", storageListener);
      supabase.removeSubscription(roomSubscription);
    };
  }, []);

  return (
    <main className="m-auto mt-4 max-w-screen-sm">
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <FaArrowLeftLong className="mr-2" />
            Back to home
          </Link>
        </Button>
      </div>
      <div className="p-3">
        <div>Room ID: {props.params.id}</div>
        {token && cloudId ? (
          <div>
            <Button
              onClick={() => {
                localStorage.removeItem("jira");
                setToken("");
                setCloudId("");
              }}
            >
              Clear storage
            </Button>
            <div className="mt-4">
              <div className="flex gap-2">
                <JiraProjects
                  projectId={projectId}
                  onSelectProject={(id) => {
                    setProjectId(id);
                    setBoardId("");
                  }}
                />
                <JiraBoards
                  boardId={boardId}
                  projectId={projectId}
                  onSelectBoard={(id) => {
                    setBoardId(id);
                  }}
                />
              </div>
              <JiraSprints boardId={boardId} />
            </div>
          </div>
        ) : (
          <div>
            <ConnectToJira state={props.params.id} />
          </div>
        )}
        {roomData && (
          <div>
            <h2>Real-time Updates</h2>
            <p>Room data: {JSON.stringify(roomData)}</p>
          </div>
        )}
      </div>
    </main>
  );
}
