'use client';

import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {InstallStatusBadge} from "./InstallStatusBadge"
import {Separator} from '@/components/ui/separator';
import {useToast} from '@/hooks/use-toast';
import {AlertTriangle, CheckCircle2, Loader2, Lock, RotateCcw, Save} from 'lucide-react';
import {StartupResponse,} from '@/app/_components/page/settings/utils/types';
import * as settingsClient from "@/app/_services/protected/client/settingsClientService";
import {ProvisioningStatusBadge} from "@/app/_components/page/dashboard/ServerCard/ProvisioningStatusBadge";
import {fetchSubscriptionProvisioningStatus} from "@/app/_services/protected/client/subscriptionClientService";
import {Egg, EggVariable, ProvisioningStatus} from "@/app/types";
import {Alert, AlertDescription} from "@/components/ui/alert";

interface ServerSettingsProps {
  eggs: Egg[];
  subscriptionId: string;
}

export default function ServerSettings({ eggs, subscriptionId}: ServerSettingsProps) {
  const [settings, setSettings] = useState<StartupResponse | null>(null);
  const [status, setStatus] = useState<ProvisioningStatus>(ProvisioningStatus.PENDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reinstalling, setReinstalling] = useState(false);
  const [previousEggId, setPreviousEggId] = useState<number>(0);
  const { toast } = useToast();

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
    loadStatus();
  }, [subscriptionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [subscriptionId]);

  useEffect(() => {
    if (formData.eggId > 0 && settings) {
      const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
      const previousEgg = eggs.find(egg => egg.id === previousEggId);

      if (selectedEgg) {
        setFormData(prev => {
          const newEnv = { ...prev.environment };

          // remove old required vars if switching eggs
          if (previousEgg && selectedEgg.id !== previousEgg.id) {
            previousEgg.variables.forEach(variable => {
              delete newEnv[variable.env_variable];
            });
          }

          // add new required vars with defaults
          selectedEgg.variables.forEach(variable => {
            if (!(variable.env_variable in newEnv)) {
              newEnv[variable.env_variable] = variable.default_value;
            }
          });

          return {
            ...prev,
            environment: newEnv,
            startup: selectedEgg.startup,
            image: (selectedEgg.docker_images && selectedEgg.docker_images.length > 0)
                ? selectedEgg.docker_images[0]
                : prev.image
          };
        });

        setPreviousEggId(formData.eggId);
      }
    }
  }, [formData.eggId, settings, previousEggId, eggs]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsClient.getSettings(subscriptionId);
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
        description: 'Could not load server settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStatus = async () => {
    try {
      const provisioningStatus = await fetchSubscriptionProvisioningStatus(subscriptionId);
      setStatus(provisioningStatus);
    } catch (error) {
      setStatus(ProvisioningStatus.ERROR);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const request = settingsClient.formDataToRequest(formData);
      await settingsClient.updateSettings(subscriptionId, request);

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });

      await loadSettings();
      await loadStatus();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not save settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const reinstallServer = async () => {
    try {
      await settingsClient.reinstallServer(subscriptionId);

      toast({
        title: 'Success',
        description: 'Server reinstall initiated',
      });

      await loadSettings();
      await loadStatus();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Reinstall failed',
        variant: 'destructive'
      });
    }
  };

  const recreateServer = async () => {
    try {
      await settingsClient.recreateServer(subscriptionId);

      toast({
        title: 'Success',
        description: 'Hardware re-creation initiated. Please wait up to 20 minutes to complete',
      });

      await loadSettings();
      await loadStatus();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Re-create failed',
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
    const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
    if (selectedEgg && selectedEgg.variables.some(v => v.env_variable === key)) {
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
    const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
    console.log('selectedEgg', selectedEgg);
    console.log('requiredKeys', selectedEgg ? selectedEgg.variables.map(v => v.env_variable) : []);
    return selectedEgg ? selectedEgg.variables.map(v => v.env_variable) : [];
  };

  const getOptionalKeys = (): string[] => {
    const requiredKeys = getRequiredKeys();
    return Object.keys(formData.environment).filter(key => !requiredKeys.includes(key));
  };

  const isRequired = (key: string): boolean => {
    return getRequiredKeys().includes(key);
  };

  const getdefault_value = (key: string): string => {
    const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
    const variable = selectedEgg?.variables.find(v => v.env_variable === key);
    return variable?.default_value || '';
  };

  const getVariableByKey = (key: string): EggVariable | undefined => {
    const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
    return selectedEgg?.variables.find(v => v.env_variable === key);
  };

  const restoreDefault = (key: string) => {
    const default_value = getdefault_value(key);
    updateEnvironmentVariable(key, default_value);
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
          Failed to load server settings
        </div>
    );
  }

  const requiredKeys = getRequiredKeys();
  const optionalKeys = getOptionalKeys();

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Server Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <InstallStatusBadge installed={settings.installed} />
            <ProvisioningStatusBadge status={status} />
          </div>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            These settings are for advanced users. Please exercise caution.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          {/* basic settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startup">Startup Command</Label>
                <Input
                    id="startup"
                    value={formData.startup}
                    onChange={(e) => setFormData(prev => ({ ...prev, startup: e.target.value }))}
                    placeholder="java -jar server.jar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Docker Image</Label>
                <Select
                    value={formData.image}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select docker image" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const selectedEgg = eggs.find(egg => egg.id === formData.eggId);
                      if (!selectedEgg || !selectedEgg.docker_images || selectedEgg.docker_images.length === 0) {
                        return <SelectItem value="" disabled>no images available</SelectItem>;
                      }
                      return selectedEgg.docker_images.map(image => (
                          <SelectItem key={image} value={image}>
                            {image}
                          </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="egg">Server Type</Label>
                <Select
                    value={formData.eggId > 0 ? formData.eggId.toString() : undefined}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, eggId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select server type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eggs.map(egg => (
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
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* required vars first */}
              {requiredKeys.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">Required Variables</Label>
                    </div>
                    {requiredKeys
                        .filter(key => getVariableByKey(key)?.user_viewable)
                        .map(key => {
                      const variable = getVariableByKey(key);
                      const isEditable = variable?.user_editable ?? true;
                      return (
                          <React.Fragment key={key}>
                            <div className="flex items-center gap-2">
                              <Input
                                  value={key}
                                  disabled
                                  className="flex-1 bg-muted"
                              />
                              <Input
                                  value={formData.environment[key] || ''}
                                  onChange={(e) => updateEnvironmentVariable(key, e.target.value)}
                                  disabled={!isEditable}
                                  className={`flex-1 ${!isEditable ? 'bg-muted' : ''}`}
                                  placeholder={variable?.default_value || 'null'}
                              />
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => restoreDefault(key)}
                                  disabled={!isEditable}
                                  title="restore default"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </div>
                            {variable?.description && (
                                <p className="text-sm text-muted-foreground pl-2">
                                  {variable.description}
                                </p>
                            )}
                          </React.Fragment>
                      );
                    })}

                    {optionalKeys.length > 0 && <Separator />}
                  </>
              )}

              {/* optional vars */}
              {optionalKeys.length > 0 && (
                  <>
                    <Label className="text-sm font-medium">Optional Variables</Label>
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
                            Remove
                          </Button>
                        </div>
                    ))}
                  </>
              )}

              <Separator />

              <div className="flex items-center gap-2">
                <Input
                    placeholder="Variable name"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    className="flex-1"
                />
                <Input
                    placeholder="Variable value"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={addEnvironmentVariable} disabled={!newEnvKey || !newEnvValue}>
                  Add
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
                    Reinstall Server
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Confirm Server Reinstall
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reinstall the server with the current configuration and variables. WARNING: Data WILL be LOST. Take a backup first!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={reinstallServer}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, reinstall server
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    {reinstalling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Re-create Hardware
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Confirm Hardware Re-create
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will migrate your server on to new hardware. ALL DATA (INCLUDING BACKUPS) WILL BE LOST. This is only necessary if your server is in a broken state and you need a clean slate.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={recreateServer}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, recreate hardware
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button onClick={saveSettings} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
  );
}