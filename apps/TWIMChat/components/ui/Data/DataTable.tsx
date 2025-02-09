"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/misc/badge";
import { Button } from "@/components/ui/Button/button";
import { Input } from "@/components/ui/misc/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/misc/table";
import { Pencil, Trash } from "@mynaui/icons-react";
import { useDebounce } from "@/hooks/use-debounce";

type Topic = {
  id: number;
  title: string;
  description: string;
  roomsCount: number;
};

export default function DataTable() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce the search term with a delay of 500ms.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch topics from the API based on the debounced search term.
  useEffect(() => {
    async function fetchTopics() {
      let url = "";
      if (debouncedSearchTerm.trim() === "") {
        // Default: Fetch the 5 topics with the most rooms.
        url = "/api/topics?sort=roomsCount&order=desc&limit=5";
      } else {
        // Search query: Fetch topics matching the search term.
        url = `/api/topics?search=${encodeURIComponent(debouncedSearchTerm)}`;
      }
      
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch topics: ${res.statusText}`);
        }
        const data = await res.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }
    
    fetchTopics();
  }, [debouncedSearchTerm]);

  return (
    <div className="mx-auto my-6 w-full max-w-6xl rounded border">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 md:py-2">
        <h1 className="text-xl font-bold">Topics</h1>
        <Input
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-96"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topic) => (
            <TableRow key={topic.id}>
              <TableCell className="font-medium">{topic.title}</TableCell>
              <TableCell>{topic.description}</TableCell>
              <TableCell>{topic.roomsCount}</TableCell>
              <TableCell className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}