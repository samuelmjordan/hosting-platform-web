'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {Loader2, Save, RotateCcw, AlertTriangle, Lock} from 'lucide-react';
import {
  StartupResponse,
  UpdateStartupRequest,
  EGG_OPTIONS,
} from '@/app/_components/page/settings/utils/types';
import {
  PterodactylServerSettingsClient,
  formDataToRequest
} from '@/app/_components/page/settings/utils/client';

interface ServerSettingsProps {
  subscriptionId: string;
  userId: string;
}

export default function ServerSettings({ subscriptionId, userId }: ServerSettingsProps) {
  const [settings, setSettings] = useState<StartupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reinstalling, setReinstalling] = useState(false);
  const [previousEggId, setPreviousEggId] = useState<number>(0);
  const { toast } = useToast();

  const client = new PterodactylServerSettingsClient(
      process.env.NEXT_PUBLIC_API_URL || '',
      userId,
      subscriptionId
  );

  const [formData, setFormData] = useState({
    startup: '',
    image: '',
    eggId: 0,
    environment: {} as Record<string, string>
  });

  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvValue, setNewEnvValue] = useState('');

  useEffect(() => {
    loadSettings();
  }, [subscriptionId, userId]);

  useEffect(() => {
    if (formData.eggId > 0 && settings) {
      const selectedEgg = EGG_OPTIONS.find(egg => egg.id === formData.eggId);
      const previousEgg = EGG_OPTIONS.find(egg => egg.id === previousEggId);

      if (selectedEgg) {
        setFormData(prev => {
          const newEnv = { ...prev.environment };

          // remove old required vars if switching eggs
          if (previousEgg && selectedEgg.id !== previousEgg.id) {
            Object.keys(previousEgg.requiredEnvVars).forEach(key => {
              delete newEnv[key];
            });
          }

          // add new required vars with defaults
          Object.entries(selectedEgg.requiredEnvVars).forEach(([key, defaultValue]) => {
            if (!(key in newEnv)) {
              newEnv[key] = defaultValue;
            }
          });

          return { ...prev, environment: newEnv };
        });

        setPreviousEggId(formData.eggId);
      }
    }
  }, [formData.eggId, settings, previousEggId]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await client.getSettings();
      setSettings(data);

      setFormData({
        startup: data.startup_command,
        image: data.image,
        eggId: data.egg_id,
        environment: { ...data.environment }
      });

      setPreviousEggId(data.egg_id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'could not load server settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const request = formDataToRequest(formData);
      await client.updateSettings(request);

      toast({
        title: 'Success',
        description: 'settings saved successfully',
      });

      await loadSettings(); // refresh
    } catch (error) {
      toast({
        title: 'Error',
        description: 'could not save settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const reinstallServer = async () => {
    try {
      await client.reinstallServer();

      toast({
        title: 'Success',
        description: 'server reinstall initiated',
      });

      await loadSettings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'reinstall failed',
        variant: 'destructive'
      });
    }
  };

  const recreateServer = async () => {
    try {
      await client.recreateServer();

      toast({
        title: 'Success',
        description: 'server re-creation initiated. please wait up to 20 minutes to complete',
      });

      await loadSettings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'recreate failed',
        variant: 'destructive'
      });
    }
  };

  const addEnvironmentVariable = () => {
    if (newEnvKey && newEnvValue) {
      setFormData(prev => ({
        ...prev,
        environment: {
          ...prev.environment,
          [newEnvKey]: newEnvValue
        }
      }));
      setNewEnvKey('');
      setNewEnvValue('');
    }
  };

  const removeEnvironmentVariable = (key: string) => {
    const selectedEgg = EGG_OPTIONS.find(egg => egg.id === formData.eggId);
    if (selectedEgg && key in selectedEgg.requiredEnvVars) {
      return; // can't remove required vars
    }

    setFormData(prev => {
      const newEnv = { ...prev.environment };
      delete newEnv[key];
      return { ...prev, environment: newEnv };
    });
  };

  const updateEnvironmentVariable = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      environment: {
        ...prev.environment,
        [key]: value
      }
    }));
  };

  const getRequiredKeys = (): string[] => {
    const selectedEgg = EGG_OPTIONS.find(egg => egg.id === formData.eggId);
    return selectedEgg ? Object.keys(selectedEgg.requiredEnvVars) : [];
  };

  const getOptionalKeys = (): string[] => {
    const requiredKeys = getRequiredKeys();
    return Object.keys(formData.environment).filter(key => !requiredKeys.includes(key));
  };

  const isRequired = (key: string): boolean => {
    return getRequiredKeys().includes(key);
  };

  const getDefaultValue = (key: string): string => {
    const selectedEgg = EGG_OPTIONS.find(egg => egg.id === formData.eggId);
    return selectedEgg?.requiredEnvVars[key] || '';
  };

  const restoreDefault = (key: string) => {
    const defaultValue = getDefaultValue(key);
    updateEnvironmentVariable(key, defaultValue);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!settings) {
    return (
        <div className="text-center text-muted-foreground">
          failed to load server settings
        </div>
    );
  }

  const requiredKeys = getRequiredKeys();
  const optionalKeys = getOptionalKeys();

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">server settings</h1>
            <p className="text-muted-foreground">subscription: {subscriptionId}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={settings.installed ? "default" : "secondary"}>
              {settings.installed ? "installed" : "not installed"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* basic settings */}
          <Card>
            <CardHeader>
              <CardTitle>basic configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startup">startup command</Label>
                <Input
                    id="startup"
                    value={formData.startup}
                    onChange={(e) => setFormData(prev => ({ ...prev, startup: e.target.value }))}
                    placeholder="java -jar server.jar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">docker image</Label>
                <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="ghcr.io/pterodactyl/yolks:java_17"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="egg">server type</Label>
                <Select
                    value={formData.eggId > 0 ? formData.eggId.toString() : undefined}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, eggId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select server type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EGG_OPTIONS.map(egg => (
                        <SelectItem key={egg.id} value={egg.id.toString()}>
                          {egg.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* environment variables */}
          <Card>
            <CardHeader>
              <CardTitle>environment variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* required vars first */}
              {requiredKeys.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">required variables</Label>
                    </div>
                    {requiredKeys.map(key => (
                        <div key={key} className="flex items-center gap-2">
                          <Input
                              value={key}
                              disabled
                              className="flex-1 bg-muted"
                          />
                          <Input
                              value={formData.environment[key] || ''}
                              onChange={(e) => updateEnvironmentVariable(key, e.target.value)}
                              className="flex-1"
                              placeholder={`null`}
                          />
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreDefault(key)}
                              title="restore default"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                    ))}

                    {optionalKeys.length > 0 && <Separator />}
                  </>
              )}

              {/* optional vars */}
              {optionalKeys.length > 0 && (
                  <>
                    <Label className="text-sm font-medium">optional variables</Label>
                    {optionalKeys.map(key => (
                        <div key={key} className="flex items-center gap-2">
                          <Input
                              value={key}
                              disabled
                              className="flex-1"
                          />
                          <Input
                              value={formData.environment[key]}
                              onChange={(e) => updateEnvironmentVariable(key, e.target.value)}
                              className="flex-1"
                          />
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEnvironmentVariable(key)}
                          >
                            remove
                          </Button>
                        </div>
                    ))}
                  </>
              )}

              <Separator />

              <div className="flex items-center gap-2">
                <Input
                    placeholder="variable name"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    className="flex-1"
                />
                <Input
                    placeholder="variable value"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={addEnvironmentVariable} disabled={!newEnvKey || !newEnvValue}>
                  add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* actions */}
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={reinstalling}>
                    {reinstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <RotateCcw className="mr-2 h-4 w-4" />
                    reinstall server
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      confirm server reinstall
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      this will completely wipe your server and reinstall it from scratch.
                      ALL DATA WILL BE LOST. this action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={reinstallServer}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      yes, reinstall server
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    {reinstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    re-create server
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      confirm server re-create
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      this will destroy your server and create a new one. ALL DATA WILL BE LOST. this action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={recreateServer}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      yes, recreate server
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button onClick={saveSettings} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              save changes
            </Button>
          </div>
        </div>
      </div>
  );
}