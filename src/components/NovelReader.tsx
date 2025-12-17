import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  gallery: string[];
}

interface DialogLine {
  characterId: string;
  text: string;
  emotion?: string;
}

interface Paragraph {
  id: string;
  type: 'text' | 'dialog';
  content: string | DialogLine[];
  image?: string;
}

interface Episode {
  id: string;
  title: string;
  paragraphs: Paragraph[];
  backgroundImage?: string;
}

export default function NovelReader() {
  const [currentEpisode, setCurrentEpisode] = useState(0);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [bookmarks, setBookmarks] = useState<{ episodeId: string; paragraphId: string; note: string }[]>([]);
  const [showCharacters, setShowCharacters] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([
    {
      id: '1',
      title: 'Глава 1. Фестиваль фонарей',
      backgroundImage: 'https://cdn.poehali.dev/files/u3875968173_quote_background_close-up_of_japanese_lanterns_wi_7076d7a0-fe3b-4374-aa35-93e85d6c7fe8_0.png',
      paragraphs: [
        {
          id: '1-1',
          type: 'text',
          content: 'Вечерний город оживал под светом тысячи бумажных фонарей. Красные, розовые, золотые — они покачивались на ветру, словно морские медузы в невидимых течениях.',
          image: 'https://cdn.poehali.dev/files/u3875968173_quote_background_close-up_of_japanese_lanterns_wi_7076d7a0-fe3b-4374-aa35-93e85d6c7fe8_0.png'
        },
        {
          id: '1-2',
          type: 'dialog',
          content: [
            {
              characterId: '1',
              text: 'Как же красиво! Я всю жизнь мечтала увидеть этот фестиваль.',
              emotion: 'happy'
            }
          ]
        },
        {
          id: '1-3',
          type: 'text',
          content: 'Запах жареных каштанов и сладкой ваты смешивался с ароматом весенних цветов. Толпа медленно двигалась по узким улочкам, освещённым мягким сиянием фонарей.'
        },
        {
          id: '1-4',
          type: 'dialog',
          content: [
            {
              characterId: '2',
              text: 'Каждый фонарь — это чья-то мечта, запущенная в небо.',
              emotion: 'neutral'
            },
            {
              characterId: '1',
              text: 'Тогда мне нужно загадать самое важное желание...',
              emotion: 'shy'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Глава 2. Первая встреча',
      backgroundImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
      paragraphs: [
        {
          id: '2-1',
          type: 'text',
          content: 'На следующее утро Анна отправилась исследовать окрестности. Узкие улочки вели к скалистому берегу, где старый маяк возвышался над бирюзовыми волнами.'
        }
      ]
    }
  ]);

  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [newParagraphType, setNewParagraphType] = useState<'text' | 'dialog'>('text');
  const [newParagraphContent, setNewParagraphContent] = useState('');
  const [newParagraphImage, setNewParagraphImage] = useState('');

  const characters: Character[] = [
    {
      id: '1',
      name: 'Анна',
      description: 'Главная героиня романа. Молодая художница, ищущая вдохновение в тихом городке у моря.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop'
      ]
    },
    {
      id: '2',
      name: 'Максим',
      description: 'Загадочный писатель, живущий в старом особняке на окраине города.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
      ]
    }
  ];

  const episode = episodes[currentEpisode];
  const paragraph = episode.paragraphs[currentParagraph];

  const getCharacter = (id: string) => characters.find(c => c.id === id);

  const toggleBookmark = () => {
    const exists = bookmarks.find(b => b.episodeId === episode.id && b.paragraphId === paragraph.id);
    
    if (exists) {
      setBookmarks(bookmarks.filter(b => !(b.episodeId === episode.id && b.paragraphId === paragraph.id)));
    } else {
      setBookmarks([...bookmarks, { 
        episodeId: episode.id, 
        paragraphId: paragraph.id, 
        note: `${episode.title} - Параграф ${currentParagraph + 1}` 
      }]);
    }
  };

  const isBookmarked = bookmarks.some(b => b.episodeId === episode.id && b.paragraphId === paragraph.id);

  const goToNextParagraph = () => {
    if (currentParagraph < episode.paragraphs.length - 1) {
      setCurrentParagraph(currentParagraph + 1);
    } else if (currentEpisode < episodes.length - 1) {
      setCurrentEpisode(currentEpisode + 1);
      setCurrentParagraph(0);
    }
  };

  const goToPrevParagraph = () => {
    if (currentParagraph > 0) {
      setCurrentParagraph(currentParagraph - 1);
    } else if (currentEpisode > 0) {
      setCurrentEpisode(currentEpisode - 1);
      setCurrentParagraph(episodes[currentEpisode - 1].paragraphs.length - 1);
    }
  };

  const addNewEpisode = () => {
    const newEpisode: Episode = {
      id: `${episodes.length + 1}`,
      title: `Глава ${episodes.length + 1}. Новая глава`,
      backgroundImage: 'https://cdn.poehali.dev/files/u3875968173_quote_background_close-up_of_japanese_lanterns_wi_7076d7a0-fe3b-4374-aa35-93e85d6c7fe8_0.png',
      paragraphs: []
    };
    setEpisodes([...episodes, newEpisode]);
    setEditingEpisode(newEpisode);
  };

  const updateEpisode = (episodeId: string, updates: Partial<Episode>) => {
    setEpisodes(episodes.map(ep => 
      ep.id === episodeId ? { ...ep, ...updates } : ep
    ));
  };

  const deleteEpisode = (episodeId: string) => {
    setEpisodes(episodes.filter(ep => ep.id !== episodeId));
    setEditingEpisode(null);
  };

  const addParagraphToEpisode = (episodeId: string) => {
    if (!newParagraphContent.trim()) return;

    const newParagraph: Paragraph = {
      id: `${episodeId}-${Date.now()}`,
      type: newParagraphType,
      content: newParagraphType === 'text' ? newParagraphContent : [],
      image: newParagraphImage || undefined
    };

    const updatedEpisodes = episodes.map(ep => {
      if (ep.id === episodeId) {
        return {
          ...ep,
          paragraphs: [...ep.paragraphs, newParagraph]
        };
      }
      return ep;
    });

    setEpisodes(updatedEpisodes);
    setNewParagraphContent('');
    setNewParagraphImage('');
  };

  const deleteParagraph = (episodeId: string, paragraphId: string) => {
    const updatedEpisodes = episodes.map(ep => {
      if (ep.id === episodeId) {
        return {
          ...ep,
          paragraphs: ep.paragraphs.filter(p => p.id !== paragraphId)
        };
      }
      return ep;
    });
    setEpisodes(updatedEpisodes);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">История одного лета</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowAdmin(true)}>
              <Icon name="Settings" size={20} />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleBookmark}>
              <Icon name={isBookmarked ? "Bookmark" : "BookmarkPlus"} size={20} />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icon name="BookMarked" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Закладки</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {bookmarks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет сохранённых закладок</p>
                  ) : (
                    <div className="space-y-2">
                      {bookmarks.map((bookmark, idx) => (
                        <Card 
                          key={idx} 
                          className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                          onClick={() => {
                            const epIdx = episodes.findIndex(e => e.id === bookmark.episodeId);
                            const parIdx = episodes[epIdx].paragraphs.findIndex(p => p.id === bookmark.paragraphId);
                            setCurrentEpisode(epIdx);
                            setCurrentParagraph(parIdx);
                          }}
                        >
                          <p className="text-sm font-medium">{bookmark.note}</p>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={() => setShowCharacters(true)}>
              <Icon name="Users" size={20} />
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="grid lg:grid-cols-[1fr_1.2fr] min-h-[calc(100vh-4rem)] relative">
          <div className="relative order-2 lg:order-1 flex flex-col z-10 bg-background">
            <div className="absolute -right-1 top-0 bottom-0 w-32 hidden lg:block overflow-hidden">
              <svg 
                viewBox="0 0 100 1000" 
                preserveAspectRatio="none" 
                className="h-full w-full"
                style={{ transform: 'translateX(1px)' }}
              >
                <path 
                  d="M0 0 Q50 50 0 100 T0 200 T0 300 T0 400 T0 500 T0 600 T0 700 T0 800 T0 900 T0 1000 L0 0 Z" 
                  fill="hsl(var(--background))" 
                />
              </svg>
            </div>
            <ScrollArea className="flex-1 p-6 lg:p-12 lg:pr-24">
              <div className="max-w-2xl mx-auto animate-fade-in">
                <h2 className="text-3xl font-bold mb-8">{episode.title}</h2>
                
                <div className="space-y-6">
                  {paragraph.type === 'text' ? (
                    <p className="text-lg leading-relaxed">{paragraph.content as string}</p>
                  ) : (
                    <div className="space-y-4">
                      {(paragraph.content as DialogLine[]).map((line, idx) => {
                        const character = getCharacter(line.characterId);
                        return (
                          <div key={idx} className="flex gap-3 animate-fade-in">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={character?.avatar} />
                              <AvatarFallback>{character?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-primary mb-1">{character?.name}</p>
                              <Card className="p-3 bg-card/50">
                                <p className="text-base leading-relaxed">{line.text}</p>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {paragraph.image && paragraph.type === 'text' && (
                    <div className="lg:hidden my-6">
                      <img 
                        src={paragraph.image} 
                        alt="Scene illustration" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={goToPrevParagraph}
                    disabled={currentEpisode === 0 && currentParagraph === 0}
                  >
                    <Icon name="ChevronLeft" size={20} />
                    Назад
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    {currentParagraph + 1} / {episode.paragraphs.length}
                  </span>
                  
                  <Button 
                    variant="outline" 
                    onClick={goToNextParagraph}
                    disabled={currentEpisode === episodes.length - 1 && currentParagraph === episode.paragraphs.length - 1}
                  >
                    Далее
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div 
            className="relative order-1 lg:order-2 h-64 lg:h-auto bg-cover bg-center lg:sticky lg:top-16 animate-fade-in overflow-hidden"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${paragraph.image || episode.backgroundImage})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
          </div>
        </div>
      </main>

      <Dialog open={showCharacters} onOpenChange={setShowCharacters}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Персонажи</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {characters.map(character => (
              <Card 
                key={character.id} 
                className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedCharacter(character)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={character.avatar} />
                    <AvatarFallback>{character.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{character.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {character.description}
                    </p>
                  </div>
                </div>
                
                {character.gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {character.gallery.slice(0, 2).map((img, idx) => (
                      <img 
                        key={idx}
                        src={img} 
                        alt={`${character.name} gallery`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdmin} onOpenChange={setShowAdmin}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Управление эпизодами</DialogTitle>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 mt-4">
            <div className="space-y-4">
              <Button onClick={addNewEpisode} className="w-full">
                <Icon name="Plus" size={20} />
                Новый эпизод
              </Button>
              
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {episodes.map((ep, idx) => (
                    <Card 
                      key={ep.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        editingEpisode?.id === ep.id ? 'bg-primary/20 border-primary' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setEditingEpisode(ep)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{ep.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ep.paragraphs.length} параграфов
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEpisode(ep.id);
                          }}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {editingEpisode && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Название эпизода</Label>
                    <Input
                      value={editingEpisode.title}
                      onChange={(e) => updateEpisode(editingEpisode.id, { title: e.target.value })}
                      placeholder="Глава 1. Название"
                    />
                  </div>

                  <div>
                    <Label>Фоновое изображение (URL)</Label>
                    <Input
                      value={editingEpisode.backgroundImage || ''}
                      onChange={(e) => updateEpisode(editingEpisode.id, { backgroundImage: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold mb-4">Параграфы</h3>
                  
                  <div className="space-y-4 mb-6">
                    {editingEpisode.paragraphs.map((par, idx) => (
                      <Card key={par.id} className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary mb-2">
                              Параграф {idx + 1} ({par.type === 'text' ? 'Текст' : 'Диалог'})
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {typeof par.content === 'string' ? par.content : 'Диалог...'}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteParagraph(editingEpisode.id, par.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-4 bg-accent/20">
                    <h4 className="font-medium mb-4">Добавить параграф</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Тип параграфа</Label>
                        <Select value={newParagraphType} onValueChange={(v) => setNewParagraphType(v as 'text' | 'dialog')}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Текст</SelectItem>
                            <SelectItem value="dialog">Диалог</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Содержание</Label>
                        <Textarea
                          value={newParagraphContent}
                          onChange={(e) => setNewParagraphContent(e.target.value)}
                          placeholder="Введите текст параграфа..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Изображение (URL, опционально)</Label>
                        <Input
                          value={newParagraphImage}
                          onChange={(e) => setNewParagraphImage(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>

                      <Button onClick={() => addParagraphToEpisode(editingEpisode.id)} className="w-full">
                        <Icon name="Plus" size={20} />
                        Добавить параграф
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
