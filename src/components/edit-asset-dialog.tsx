
"use client";

import { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/datepicker";
import { Combobox } from "@/components/ui/combobox";
import { Asset, AssetFormSchema, AssetFormValues } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "./user-provider";
import { manufacturerCatalog, osCatalog } from "@/lib/catalog";
import { userNames } from "@/lib/user-catalog";

interface EditAssetDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssetUpdated: () => void;
}

export function EditAssetDialog({ asset, isOpen, onOpenChange, onAssetUpdated }: EditAssetDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);
  const [activeModelSuggestionIndex, setActiveModelSuggestionIndex] = useState(0);
  const modelSuggestionItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const modelTypingTimer = useRef<number | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const [osSuggestions, setOsSuggestions] = useState<string[]>([]);
  const [activeOsSuggestionIndex, setActiveOsSuggestionIndex] = useState(0);
  const osSuggestionItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const osTypingTimer = useRef<number | null>(null);
  const osInputRef = useRef<HTMLInputElement>(null);

  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [activeUserSuggestionIndex, setActiveUserSuggestionIndex] = useState(0);
  const userSuggestionItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const userTypingTimer = useRef<number | null>(null);
  const userInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<AssetFormValues>({
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      machineName: '',
      category: 'laptops',
      os: '',
      location: 'Schaumburg IL',
      manufacturer: '',
      partNumber: '',
      modelNumber: '',
      serialNumber: '',
      type: undefined,
      webui: "",
      assignedUser: '',
      userId: undefined,
      userType: 'local',
      owner: 'Group Administrators',
      status: 'In Use',
      notes: '',
      purchaseDate: undefined,
      warrantyExpirationDate: undefined
    }
  });

  useEffect(() => {
    if (asset && isOpen) {
      form.reset({
        ...asset,
        os: asset.os ?? '',
        type: asset.type ?? undefined,
        webui: asset.webui ? asset.webui.replace(/^https?:\/\//, '') : '',
        assignedUser: asset.assignedUser ?? '',
        userId: asset.userId ?? undefined,
        notes: asset.notes ?? '',
        owner: "Group Administrators"
      });
    }
  }, [asset, form, isOpen]);


  const category = form.watch("category");
  const showWebUI = useMemo(() => category && ['networks', 'printers', 'servers'].includes(category), [category]);
  
  const keywordIndex = useMemo(() => {
    const items: { mfr: string; cat: string; k: string; lower: string }[] = [];
    for (const mfr in manufacturerCatalog) {
      const cats = manufacturerCatalog[mfr as keyof typeof manufacturerCatalog];
      for (const cat in cats) {
        const data = (cats as any)[cat as keyof typeof cats];
        if (data?.keywords) {
          for (const k of data.keywords) {
            items.push({ mfr, cat, k, lower: k.toLowerCase() });
          }
        }
      }
    }
    return items;
  }, []);

  const getModelSuggestions = useCallback((query: string) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return keywordIndex
      .map(it => {
        let score = 0;
        if (it.lower.startsWith(q)) score = 3;
        else if (it.lower.includes(q)) score = 1;
        return { k: it.k, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.k.length - b.k.length)
      .slice(0, 8)
      .map(x => x.k);
  }, [keywordIndex]);
  
  const getOsSuggestions = useCallback((query: string) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return osCatalog.os.keywords
      .filter(k => k.toLowerCase().includes(q))
      .slice(0, 8);
  }, []);

  const getUserSuggestions = useCallback((query: string) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return userNames
      .filter(name => name.toLowerCase().includes(q))
      .slice(0, 8);
  }, []);

  const autoCategorizeByModel = useCallback((model: string): string | null => {
    if (!model) return null;
    const l = model.toLowerCase();

    let best: { manufacturer: string; category: AssetFormValues['category']; type?: string; score: number } | null = null;

    for (const manufacturer of Object.keys(manufacturerCatalog)) {
      const categoriesData = manufacturerCatalog[manufacturer as keyof typeof manufacturerCatalog];
      for (const category in categoriesData) {
        const catData = (categoriesData as any)[category as keyof typeof categoriesData];
        if (!catData?.keywords?.length) continue;

        for (const k of catData.keywords) {
          const lk = k.toLowerCase();
          let score = 0;
          if (l.startsWith(lk)) score = 3;
          else if (l.includes(lk)) score = 1;
          if (score === 0) continue;

          score += Math.min(2, Math.floor(lk.length / 8));

          let foundType: string | undefined;
          if ((category === 'systems' || category === 'servers') && catData.types) {
            for (const type in catData.types) {
              if (catData.types[type].some((t: string) => l.includes(t.toLowerCase()))) {
                foundType = type;
                score += 1;
                break;
              }
            }
          }

          if (!best || score > best.score) {
            best = { manufacturer, category: category as AssetFormValues['category'], type: foundType, score };
          }
        }
      }
    }

    if (best) {
      form.setValue('manufacturer', best.manufacturer, { shouldValidate: true });
      form.setValue('category', best.category, { shouldValidate: true });
      if (best.type) form.setValue('type', best.type, { shouldValidate: true });
      return best.manufacturer;
    }
    return null;
  }, [form]);

  const handleModelBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const model = e.target.value;
    if (model) {
        const manufacturer = autoCategorizeByModel(model);
        if (manufacturer && /dell/i.test(manufacturer)) {
            form.setValue('partNumber', model, { shouldValidate: true });
        }
    }
  };

  const acceptModelSuggestion = useCallback((value: string) => {
    form.setValue('modelNumber', value, { shouldValidate: true });
    setModelSuggestions([]);
    setActiveModelSuggestionIndex(0);
    const manufacturer = autoCategorizeByModel(value);

    if (manufacturer && /dell/i.test(manufacturer)) {
      form.setValue('partNumber', value, { shouldValidate: true });
    }
  }, [form, autoCategorizeByModel]);
  
  const acceptOsSuggestion = useCallback((value: string) => {
    form.setValue('os', value, { shouldValidate: true });
    setOsSuggestions([]);
    setActiveOsSuggestionIndex(0);
  }, [form]);

  const acceptUserSuggestion = useCallback((value: string) => {
    form.setValue('assignedUser', value, { shouldValidate: true });
    setUserSuggestions([]);
    setActiveUserSuggestionIndex(0);
  }, [form]);

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('modelNumber', value, { shouldValidate: true });

    if (modelTypingTimer.current) {
      window.clearTimeout(modelTypingTimer.current);
    }
    modelTypingTimer.current = window.setTimeout(() => {
      if (value) {
        const list = getModelSuggestions(value);
        setModelSuggestions(list);
        setActiveModelSuggestionIndex(0);
      } else {
        setModelSuggestions([]);
      }
    }, 160);
  };
  
  const handleModelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (modelSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveModelSuggestionIndex((prev) => (prev + 1) % modelSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveModelSuggestionIndex((prev) => (prev - 1 + modelSuggestions.length) % modelSuggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (modelSuggestions[activeModelSuggestionIndex]) {
        e.preventDefault();
        acceptModelSuggestion(modelSuggestions[activeModelSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setModelSuggestions([]);
    }
  };
  
  const handleOsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('os', value, { shouldValidate: true });

    if (osTypingTimer.current) {
      window.clearTimeout(osTypingTimer.current);
    }
    osTypingTimer.current = window.setTimeout(() => {
      if (value) {
        const list = getOsSuggestions(value);
        setOsSuggestions(list);
        setActiveOsSuggestionIndex(0);
      } else {
        setOsSuggestions([]);
      }
    }, 160);
  };
  
  const handleOsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (osSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveOsSuggestionIndex((prev) => (prev + 1) % osSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveOsSuggestionIndex((prev) => (prev - 1 + osSuggestions.length) % osSuggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (osSuggestions[activeOsSuggestionIndex]) {
        e.preventDefault();
        acceptOsSuggestion(osSuggestions[activeOsSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setOsSuggestions([]);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('assignedUser', value, { shouldValidate: true });

    if (userTypingTimer.current) {
      window.clearTimeout(userTypingTimer.current);
    }
    userTypingTimer.current = window.setTimeout(() => {
      if (value) {
        const list = getUserSuggestions(value);
        setUserSuggestions(list);
        setActiveUserSuggestionIndex(0);
      } else {
        setUserSuggestions([]);
      }
    }, 160);
  };

  const handleUserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (userSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveUserSuggestionIndex((prev) => (prev + 1) % userSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveUserSuggestionIndex((prev) => (prev - 1 + userSuggestions.length) % userSuggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (userSuggestions[activeUserSuggestionIndex]) {
        e.preventDefault();
        acceptUserSuggestion(userSuggestions[activeUserSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      setUserSuggestions([]);
    }
  };


  useEffect(() => {
    if (activeModelSuggestionIndex >= 0 && modelSuggestionItemRefs.current[activeModelSuggestionIndex]) {
      modelSuggestionItemRefs.current[activeModelSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeModelSuggestionIndex, modelSuggestions]);

  useEffect(() => {
    modelSuggestionItemRefs.current = modelSuggestionItemRefs.current.slice(0, modelSuggestions.length);
  }, [modelSuggestions]);
  
  useEffect(() => {
    if (activeOsSuggestionIndex >= 0 && osSuggestionItemRefs.current[activeOsSuggestionIndex]) {
      osSuggestionItemRefs.current[activeOsSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeOsSuggestionIndex, osSuggestions]);

  useEffect(() => {
    osSuggestionItemRefs.current = osSuggestionItemRefs.current.slice(0, osSuggestions.length);
  }, [osSuggestions]);
  
  useEffect(() => {
    if (activeUserSuggestionIndex >= 0 && userSuggestionItemRefs.current[activeUserSuggestionIndex]) {
      userSuggestionItemRefs.current[activeUserSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeUserSuggestionIndex, userSuggestions]);

  useEffect(() => {
    userSuggestionItemRefs.current = userSuggestionItemRefs.current.slice(0, userSuggestions.length);
  }, [userSuggestions]);


  const onSubmit = useCallback(async (data: AssetFormValues) => {
    if (!asset) return;

    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user before editing an asset.",
      });
      return;
    }

    const needsOs = data.category && !['printers','networks', 'misc'].includes(data.category);
    const normalizedOs = needsOs ? (data.os?.trim() || null) : null;
    const webui = data.webui ? `https://${data.webui.replace(/^https?:\/\//, '')}` : null;

    const dataToSend = {
      ...data,
      os: normalizedOs,
      webui: webui,
      purchaseDate: data.purchaseDate || null,
      warrantyExpirationDate: data.warrantyExpirationDate || null,
      type: data.type || null,
      updatedBy: currentUser,
    };

    try {
      const response = await fetch(`/api/assets/${asset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update asset');
      }

      toast({
        title: "Asset Updated",
        description: `${data.machineName} has been updated.`,
      });
      onAssetUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not update the asset.",
      });
    }
  }, [asset, onAssetUpdated, toast, onOpenChange, currentUser]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setModelSuggestions([]);
        setOsSuggestions([]);
        setUserSuggestions([]);
      }
      onOpenChange(open);
    }}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Asset</DialogTitle>
          <DialogDescription>
            Update the details for "{asset?.machineName}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
            
            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.owner}</FormLabel>
                  <FormControl>
                    <Input {...field} readOnly className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.machineName}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., WKSTN-DEV-01" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.category}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.manufacturer}</FormLabel>
                    <Combobox
                      options={APP_CONFIG.manufacturers.map(m => ({ value: m, label: m }))}
                      value={field.value}
                      onChange={(value) => form.setValue('manufacturer', value || '', { shouldValidate: true })}
                      placeholder="Select or type manufacturer..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.location}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.modelNumber}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          aria-autocomplete="list"
                          aria-controls="model-suggestion-list"
                          aria-expanded={modelSuggestions.length > 0}
                          aria-activedescendant={modelSuggestions.length ? `model-suggestion-${activeModelSuggestionIndex}` : undefined}
                          placeholder="e.g., Latitude 5420"
                          {...field}
                          value={field.value ?? ''}
                          onChange={handleModelChange}
                          onKeyDown={handleModelKeyDown}
                          onBlur={handleModelBlur}
                          ref={modelInputRef}
                          autoComplete="off"
                        />
                      </FormControl>
                      {modelSuggestions.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                          <ul
                            id="model-suggestion-list"
                            role="listbox"
                            className="max-h-60 overflow-auto py-1"
                          >
                            {modelSuggestions.map((s, i) => (
                              <li
                                key={s}
                                id={`model-suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeModelSuggestionIndex}
                                ref={el => { modelSuggestionItemRefs.current[i] = el }}
                                onMouseDown={(e) => { e.preventDefault(); acceptModelSuggestion(s); }}
                                className={`px-3 py-2 text-sm cursor-pointer ${i === activeModelSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.partNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HJVX6" {...field} value={field.value ?? ''} autoComplete="off"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.serialNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5J2X1Y2" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {category && !['printers', 'networks', 'misc'].includes(category) && (
                <FormField
                  control={form.control}
                  name="os"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{APP_CONFIG.labels.os}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            aria-autocomplete="list"
                            aria-controls="os-suggestion-list"
                            aria-expanded={osSuggestions.length > 0}
                            aria-activedescendant={osSuggestions.length ? `os-suggestion-${activeOsSuggestionIndex}` : undefined}
                            placeholder="e.g., Windows 11 Pro"
                            {...field}
                            value={field.value ?? ''}
                            onChange={handleOsChange}
                            onKeyDown={handleOsKeyDown}
                            ref={osInputRef}
                            autoComplete="off"
                          />
                        </FormControl>
                        {osSuggestions.length > 0 && (
                          <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                            <ul
                              id="os-suggestion-list"
                              role="listbox"
                              className="max-h-60 overflow-auto py-1"
                            >
                              {osSuggestions.map((s, i) => (
                                <li
                                  key={s}
                                  id={`os-suggestion-${i}`}
                                  role="option"
                                  aria-selected={i === activeOsSuggestionIndex}
                                  ref={el => { osSuggestionItemRefs.current[i] = el }}
                                  onMouseDown={(e) => { e.preventDefault(); acceptOsSuggestion(s); }}
                                  className={`px-3 py-2 text-sm cursor-pointer ${i === activeOsSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                                >
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {category && (category === 'systems' || category === 'servers') && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{APP_CONFIG.labels.type}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${category.slice(0, -1)} type`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(category === 'systems' ? APP_CONFIG.systemTypes : APP_CONFIG.serverTypes).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {showWebUI && (
                <FormField
                  control={form.control}
                  name="webui"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{APP_CONFIG.labels.webui}</FormLabel>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                          https://
                        </span>
                        <FormControl>
                          <Input
                            placeholder="192.168.1.1"
                            {...field}
                            value={field.value ?? ''}
                            className="rounded-l-none"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.status}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {APP_CONFIG.statuses.map((status) => (
                          <SelectItem key={status.name} value={status.name}>{status.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <p className="font-medium text-sm text-foreground mb-3">User Assignment</p>
              </div>
              <FormField
                control={form.control}
                name="assignedUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.assignedUser}</FormLabel>
                     <div className="relative">
                      <FormControl>
                        <Input
                          aria-autocomplete="list"
                          aria-controls="user-suggestion-list"
                          aria-expanded={userSuggestions.length > 0}
                          aria-activedescendant={userSuggestions.length ? `user-suggestion-${activeUserSuggestionIndex}` : undefined}
                          placeholder="e.g., John Doe"
                          {...field}
                          value={field.value ?? ''}
                          onChange={handleUserChange}
                          onKeyDown={handleUserKeyDown}
                          ref={userInputRef}
                          autoComplete="off"
                        />
                      </FormControl>
                      {userSuggestions.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                          <ul
                            id="user-suggestion-list"
                            role="listbox"
                            className="max-h-60 overflow-auto py-1"
                          >
                            {userSuggestions.map((s, i) => (
                              <li
                                key={s}
                                id={`user-suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeUserSuggestionIndex}
                                ref={el => { userSuggestionItemRefs.current[i] = el }}
                                onMouseDown={(e) => { e.preventDefault(); acceptUserSuggestion(s); }}
                                className={`px-3 py-2 text-sm cursor-pointer ${i === activeUserSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.userId}</FormLabel>
                    <FormControl>
                      <Input type="text" inputMode="numeric" placeholder="e.g., 12345" {...field} value={field.value ?? ''} autoComplete="off"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem className="space-y-3 pt-2">
                      <FormLabel>{APP_CONFIG.labels.userType}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value ?? 'local'}
                          className="flex items-center space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="local" />
                            </FormControl>
                            <FormLabel className="font-normal">Local</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="remote" />
                            </FormControl>
                            <FormLabel className="font-normal">Remote</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.purchaseDate}</FormLabel>
                    <DatePicker 
                      date={field.value ?? undefined} 
                      setDate={(d) => field.onChange(d === undefined ? null : d)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{APP_CONFIG.labels.warrantyExpirationDate}</FormLabel>
                    <DatePicker 
                      date={field.value ?? undefined} 
                      setDate={(d) => field.onChange(d === undefined ? null : d)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{APP_CONFIG.labels.notes}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Purchased from Dell Outlet. Has a scratch on the top case. Comes with a 24-inch Dell UltraSharp monitor."
                      className="resize-y"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    