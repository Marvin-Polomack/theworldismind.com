import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightCircle } from "@mynaui/icons-react"

export type CardItem = {
  id: number;
  title: string;
  image: StaticImageData;
  description: string;
  sm: string;
};

export function Card({
  card,
  onClick,
  selected,
  onMouseEnter,
  onKeyDown
}: { 
  card: CardItem; 
  onClick: () => void; 
  selected?: boolean; 
  onMouseEnter?: () => void; 
  onKeyDown?: () => void;
}) {
  return (
    <motion.li
      className={`w-full text-primary-foreground rounded-lg cursor-pointer ${selected ? "bg-twimcolor" : ""}`}
      layoutId={`card-${card.id}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex gap-6 h-20">
        <div className="min-w-20 h-20 rounded-3xl w-20 relative overflow-hidden">
          <Image
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            fill
            placeholder="blur"
          />
        </div>
        <div className="border-b h-full items-start justify-center flex flex-col flex-1 dark:border-neutral-800 border-neutral-200">
          <div className="flex items-center justify-between w-full">
            <div>
              <motion.h2
                className="font-semibold text-xl text-secondary-foreground"
                layoutId={`title-${card.id}`}
              >
                {card.title}
              </motion.h2>
              <motion.p
                className={` ${selected ? "text-black" : "text-muted-foreground"}`}
                layoutId={`title-sm-${card.id}`}
              >
                {card.sm}
              </motion.p>
            </div>
            <button className="text-white">
                <ChevronRightCircle />
            </button>
          </div>
        </div>
      </div>
      <motion.span layoutId={`description-${card.id}`} />
    </motion.li>
  );
}

export function Modal({ card, onClick, onChat }: { card: CardItem | null; onClick: () => void; onChat: () => void }) {
  return (
    <>
      <AnimatePresence>
        {!!card && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-0 bg-secondary/50"
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!!card && (
          <motion.div
            className="fixed inset-0 z-10 flex flex-col justify-center items-center"
            onClick={onClick}
          >
            <motion.div
              className="p-4 w-fit relative overflow-hidden flex items-center justify-center flex-col bg-background rounded-3xl"
              layoutId={`card-${card.id}`}
            >
              <div className="max-w-xl mx-auto flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="min-w-20 h-20 rounded-3xl w-20 relative overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      fill
                      placeholder="blur"
                    />
                  </div>
                  <div className="h-full items-start justify-center flex flex-col flex-1">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <motion.h2
                          className="font-semibold text-xl text-secondary-foreground"
                          layoutId={`title-${card.id}`}
                        >
                          {card.title}
                        </motion.h2>
                        <motion.p
                          className="text-muted-foreground"
                          layoutId={`title-sm-${card.id}`}
                        >
                          {card.sm}
                        </motion.p>
                      </div>
                      <button
                        className="py-1 px-3 rounded-full bg-blue-50 text-blue-500 text-sm font-semibold"
                        onClick={(e) => { e.stopPropagation(); onChat(); }}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
                <motion.p
                  className="text-[#969799] font-medium text-[15px]"
                  layoutId={`description-${card.id}`}
                >
                  {card.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
