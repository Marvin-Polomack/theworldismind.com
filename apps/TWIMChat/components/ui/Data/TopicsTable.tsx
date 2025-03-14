"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@heroui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";
import { CardItem, Card, Modal } from "@/components/cards/CardModal";
import defaultImage from "@/public/others/default.jpg";
import { BorderBeam } from "@/components/magicui/border-beam";

type Topic = {
  id: number;
  topic: string;
  title: string;
  description: string;
};

type TopicsTableProps = {
  onStartMatchmaking: () => void;
};

export default function TopicsTable({ onStartMatchmaking }: TopicsTableProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Debounce the search term with a delay of 500ms.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch topics from the API based on the debounced search term.
  useEffect(() => {
    async function fetchTopics() {
      let url = "";
      if (debouncedSearchTerm.trim() === "") {
        url = "/api/topics?sort=roomsCount&order=desc&limit=5";
      } else {
        url = `/api/topics?search=${encodeURIComponent(debouncedSearchTerm)}`;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch topics: ${res.statusText}`);
        const data = await res.json();
        setTopics(data);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }
    fetchTopics();
  }, [debouncedSearchTerm]);

  // Click outside handler.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll selected topic into view when navigating
  useEffect(() => {
    if (selectedIndex !== -1 && itemRefs.current[selectedIndex]) {
      // Use a more controlled approach to scrolling
      const container = wrapperRef.current?.querySelector('.overflow-y-auto');
      const item = itemRefs.current[selectedIndex];
      
      if (container && item) {
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        // Only scroll if the item is not fully visible
        if (itemRect.bottom > containerRect.bottom || itemRect.top < containerRect.top) {
          item.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest"
          });
        }
      }
    }
  }, [selectedIndex]);

  // Convert Topic to CardItem.
  const topicToCard = (topic: Topic): CardItem => ({
    id: topic.id,
    title: topic.topic,
    sm: topic.title,
    description: topic.description,
    image: defaultImage,
  });

  // Keyboard navigation.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (topics.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => (prev >= topics.length - 1 ? 0 : prev + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => (prev <= 0 ? topics.length - 1 : prev - 1));
        break;
      case "Enter":
        if (selectedIndex >= 0 && topics[selectedIndex]) {
          setSelectedCard(topicToCard(topics[selectedIndex]));
        }
        break;
      case "Escape":
        setSelectedCard(null);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleChatClick = async () => {
    if (selectedIndex < 0 || !topics[selectedIndex]) return;
    const topic = topics[selectedIndex];
    try {
      const res = await 
      fetch("/api/chat/matchmaking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic_id: topic.id }),
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.statusText}`);
      onStartMatchmaking();
    } catch (err) {
      console.error("Error starting matchmaking:", err);
    }
  };

  return (
    <div className="flex flex-col relative w-full max-w-full rounded h-full px-4" ref={wrapperRef} onKeyDown={handleKeyDown}>
      {/* Search input remains fixed */}
      <div className="sticky top-0 z-10 bg-background relative flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-4">
        <div className="relative w-full">
          <Input
            placeholder="Cherche un sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg"
          />
          <BorderBeam size={75} />
          <BorderBeam size={75} delay={7.5} />
        </div>
      </div>
      {/* Scrollable topics list with fixed height */}
      <div className="flex-1 overflow-hidden" style={{ maxHeight: 'calc(100% - 130px)' }}>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <motion.ul
            className="flex flex-col gap-4 justify-center items-center pb-6 pt-2 w-full"
            layout
            transition={{ 
              duration: 0.2, 
              ease: "easeOut"
            }}
          >
            {topics.map((topic, index) => {
              const card = topicToCard(topic);
              return (
                <div 
                  key={card.id} 
                  ref={el => { itemRefs.current[index] = el; }}
                  className="w-full"
                >
                  <Card
                    card={card}
                    selected={index === selectedIndex}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSelectedCard(card);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onKeyDown={() => handleKeyDown}
                  />
                </div>
              );
            })}
          </motion.ul>
        </div>
      </div>
      <Modal card={selectedCard} onClick={() => setSelectedCard(null)} onChat={handleChatClick} />
    </div>
  );
}