"use client";

import { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { AssetFormSchema, AssetFormValues } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";
import { manufacturerCatalog } from "@/lib/catalog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/components/user-provider";
import { ClipboardCopy, FileJson, RotateCcw } from "lucide-react";
import { Label } from "./ui/label";

interface AddAssetDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssetAdded: () => void;
}

function JsonImportDialog({
  isOpen,
  onOpenChange,
  onImport,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (data: any) => void;
}) {
  const { toast } = useToast();
  const [jsonString, setJsonString] = useState("");

  const handleImport = () => {
    try {
      if (!jsonString.trim()) {
        throw new Error("JSON input cannot be empty.");
      }
      const data = JSON.parse(jsonString);
      onImport(data);
      onOpenChange(false);
      setJsonString("");
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format.";
      toast({
        variant: "destructive",
        title: "JSON Import Error",
        description: errorMessage,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from JSON</DialogTitle>
          <DialogDescription>
            Paste the JSON output from your command into the text area below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="json-import-textarea">JSON Data</Label>
            <Textarea
              id="json-import-textarea"
              placeholder='{ "Machine Name": "PC-1234", ... }'
              value={jsonString}
              onChange={(e) => setJsonString(e.target.value)}
              className="h-48 resize-y"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport}>Import</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CommandDisplayDialog({
  isOpen,
  onOpenChange,
  command
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  command: string;
}) {
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      toast({ title: "Copied", description: "Command copied to clipboard." });
    } catch {
      toast({ variant: "destructive", title: "Copy failed", description: "Press Ctrl+C to copy manually." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Information Script</DialogTitle>
          <DialogDescription>
            Highlight the command below and copy it. Then paste it into the Command Prompt on the target machine.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            readOnly 
            value={command} 
            className="font-mono"
            onFocus={(e) => e.target.select()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={copy}>Copy</Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function AddAssetDialog({ isOpen, onOpenChange, onAssetAdded }: AddAssetDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const infoScriptCommand = "\\\\ga-fs5\\home$\\scripts\\json_bat\\system-info.bat";
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const suggestionItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typingTimer = useRef<number | null>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<AssetFormValues>({
    resolver: zodResolver(AssetFormSchema),
    defaultValues: {
      machineName: "",
      category: "laptops",
      os: "",
      location: "Schaumburg IL",
      manufacturer: "",
      partNumber: "",
      modelNumber: "",
      serialNumber: "",
      type: undefined,
      assignedUser: "",
      userId: undefined,
      userType: "local",
      owner: "Group Administrators",
      status: "In Use",
      notes: "",
      purchaseDate: undefined,
      warrantyExpirationDate: undefined
    },
  });

  const category = form.watch("category");

  const keywordIndex = useMemo(() => {
    const items: { mfr: string; cat: string; k: string; lower: string }[] = [];
    for (const mfr in manufacturerCatalog) {
      const cats = manufacturerCatalog[mfr as keyof typeof manufacturerCatalog];
      for (const cat in cats) {
        const data = (cats as any)[cat];
        if (data?.keywords) {
          for (const k of data.keywords) {
            items.push({ mfr, cat, k, lower: k.toLowerCase() });
          }
        }
      }
    }
    return items;
  }, []);

  const getSuggestions = useCallback((query: string) => {
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
      .sort((a, b) => b.score - a.score || a.k.length - b.k.length)
      .slice(0, 8)
      .map(x => x.k);
  }, [keywordIndex]);
  
  const autoCategorizeByModel = useCallback((model: string) => {
    if (!model) return;
    const l = model.toLowerCase();

    let best: { manufacturer: string; category: AssetFormValues['category']; type?: string; score: number } | null = null;

    for (const manufacturer of Object.keys(manufacturerCatalog)) {
      const categoriesData = manufacturerCatalog[manufacturer as keyof typeof manufacturerCatalog];
      for (const category in categoriesData) {
        const catData = categoriesData[category as keyof typeof categoriesData];
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
              if (catData.types[type].some((t) => l.includes(t.toLowerCase()))) {
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
    }
  }, [form]);

  const acceptSuggestion = useCallback((value: string) => {
    form.setValue('modelNumber', value, { shouldValidate: true });
    setSuggestions([]);
    setActiveSuggestionIndex(0);
    autoCategorizeByModel(value);
  }, [form, autoCategorizeByModel]);

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('modelNumber', value, { shouldValidate: true });

    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current);
    }
    typingTimer.current = window.setTimeout(() => {
      if (value) {
        const list = getSuggestions(value);
        setSuggestions(list);
        setActiveSuggestionIndex(0);
      } else {
        setSuggestions([]);
      }
    }, 160);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const chosen = suggestions[activeSuggestionIndex];
      if (chosen) acceptSuggestion(chosen);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionItemRefs.current[activeSuggestionIndex]) {
      suggestionItemRefs.current[activeSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeSuggestionIndex, suggestions]);

  useEffect(() => {
    suggestionItemRefs.current = suggestionItemRefs.current.slice(0, suggestions.length);
  }, [suggestions]);

  
  const handleJsonImport = (data: any) => {
    const normalize = (v: unknown) => String(v ?? '').replace(/\r?\n|\r/g, '').trim();

    const mapping: Record<string, keyof AssetFormValues> = {
      "Assigned User": "assignedUser",
      "Machine Name": "machineName",
      "Computer": "machineName",
      "Manufacturer": "manufacturer",
      "Model": "modelNumber",
      "Model Number": "modelNumber",
      "Serial": "serialNumber",
      "Serial Number": "serialNumber",
      "OS": "os",
    };

    let fieldsUpdated = false;
    let importedModelNumber = '';
    let importedManufacturer = '';

    for (const [key, raw] of Object.entries(data)) {
      const formField = mapping[key];
      if (!formField) continue;
      const value = normalize(raw);
      if (value) {
        form.setValue(formField, value, { shouldValidate: true });
        if (formField === 'manufacturer') importedManufacturer = value;
        if (formField === 'modelNumber') importedModelNumber = value;
        fieldsUpdated = true;
      }
    }

    if (importedModelNumber) {
      autoCategorizeByModel(importedModelNumber);
    }

    if (!form.getValues('partNumber') && /dell/i.test(importedManufacturer || form.getValues('manufacturer')) && importedModelNumber) {
      form.setValue('partNumber', importedModelNumber, { shouldValidate: true });
    }

    toast({
      variant: fieldsUpdated ? 'default' : 'destructive',
      title: fieldsUpdated ? 'Import Successful' : 'Import Failed',
      description: fieldsUpdated
        ? 'Asset details have been imported into the form.'
        : 'No matching fields were found in the provided JSON.',
    });
  };

  const onSubmit = useCallback(async (data: AssetFormValues) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user before adding an asset.",
      });
      return;
    }

    const dataToSend = {
      ...data,
      purchaseDate: data.purchaseDate || null,
      warrantyExpirationDate: data.warrantyExpirationDate || null,
      type: data.type || null,
      createdBy: currentUser,
      updatedBy: currentUser,
    };
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to add asset');
      }

      toast({
        title: "Asset Added",
        description: `${data.machineName} has been added to the inventory.`,
      });
      form.reset();
      onAssetAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add asset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add the asset.",
      });
    }
  }, [onAssetAdded, onOpenChange, toast, currentUser, form]);

  return (
    <>
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setSuggestions([]);
      }
      onOpenChange(open);
    }}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          if (suggestions.length > 0 && modelInputRef.current && !modelInputRef.current.contains(e.target as Node)) {
            setSuggestions([]);
          } else if (suggestions.length > 0) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new asset to the inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsJsonImportOpen(true)} className="shadow-sm">
              <FileJson className="mr-2 h-4 w-4" />
              Import from JSON
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCommandDialogOpen(true)} className="shadow-sm">
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy Info Script
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={() => { form.reset(); setSuggestions([]); }} className="ml-auto shadow-sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear Form
            </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
            
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
                      <Input placeholder="e.g., WKSTN-DEV-01" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input
                        aria-autocomplete="list"
                        aria-controls="model-suggestion-list"
                        aria-expanded={suggestions.length > 0}
                        aria-activedescendant={suggestions.length ? `model-suggestion-${activeSuggestionIndex}` : undefined}
                        placeholder="e.g., Latitude 5420"
                        {...field}
                        onChange={handleModelChange}
                        onKeyDown={handleKeyDown}
                        ref={modelInputRef}
                        autoComplete="off"
                      />
                      {suggestions.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow">
                          <ul
                            id="model-suggestion-list"
                            role="listbox"
                            className="max-h-60 overflow-auto py-1"
                          >
                            {suggestions.map((s, i) => (
                              <li
                                key={s}
                                id={`model-suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeSuggestionIndex}
                                ref={el => { suggestionItemRefs.current[i] = el }}
                                onMouseDown={(e) => { e.preventDefault(); acceptSuggestion(s); }}
                                className={`px-3 py-2 text-sm cursor-pointer ${i === activeSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'}`}
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
                      <Input placeholder="e.g., HJVX6" {...field} />
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
                      <Input placeholder="e.g., 5J2X1Y2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.os}</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Windows 11 Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(category === 'systems' || category === 'servers') && (
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{APP_CONFIG.labels.status}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
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
                      <Input type="text" inputMode="numeric" placeholder="e.g., 12345" {...field} value={field.value ?? ''} />
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
                          defaultValue={field.value}
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
                    <DatePicker date={field.value ?? undefined} setDate={(d) => field.onChange(d ?? undefined)} />
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
                    <DatePicker date={field.value ?? undefined} setDate={(d) => field.onChange(d ?? undefined)} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex-row justify-end items-center gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
     <JsonImportDialog
        isOpen={isJsonImportOpen}
        onOpenChange={setIsJsonImportOpen}
        onImport={handleJsonImport}
      />
    <CommandDisplayDialog
        isOpen={isCommandDialogOpen}
        onOpenChange={setIsCommandDialogOpen}
        command={infoScriptCommand}
    />
    </>
  );
}