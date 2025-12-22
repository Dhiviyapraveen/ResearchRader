import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { profileApi, User } from '@/services/api';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Tag,
  GraduationCap
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.get();
        setProfile(data);
      } catch (error) {
        // Fallback to auth user data if profile API fails
        if (authUser) {
          setProfile(authUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading profile..." />
      </div>
    );
  }

  const displayProfile = profile || authUser;

  if (!displayProfile) {
    return null;
  }

  const locationParts = [
    displayProfile.location?.city,
    displayProfile.location?.state,
    displayProfile.location?.country,
  ].filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-display">Profile</h1>
        <p className="text-muted-foreground">
          Your account information and research interests
        </p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Header Banner */}
        <div className="h-24 bg-gradient-to-r from-primary to-accent" />
        
        {/* Avatar & Name */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card border-4 border-card shadow-elevated">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold font-display">{displayProfile.name}</h2>
              <p className="text-muted-foreground">Researcher</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{displayProfile.email}</p>
            </div>
          </div>

          {locationParts.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{locationParts.join(', ')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Research Interests */}
      {displayProfile.interests && displayProfile.interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Research Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {displayProfile.interests.map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty Interests State */}
      {(!displayProfile.interests || displayProfile.interests.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <Tag className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No research interests added</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your research interests will appear here once added
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
