import React from 'react';
import {
  GraduationCap,
  Users,
  Award,
  Globe,
  Star,
  User,
  Trophy,
  Heart,
  Handshake,
  Landmark,
  FileText,
  Shield,
  ShieldCheck,
  BookOpen,
  Plane,
  HeartHandshake,
  Paperclip,
  CheckCircle,
  HelpCircle,
  Sprout,
  Building2,
  Briefcase,
  Coins,
  BadgeDollarSign,
  Percent,
  TrendingUp,
  Atom,
  Bookmark,
  UserCheck,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name?.toLowerCase()) {
    case 'graduationcap':
    case 'cap':
      return <GraduationCap className={className} />;
    case 'users':
    case 'usergroup':
      return <Users className={className} />;
    case 'user':
      return <User className={className} />;
    case 'usercheck':
      return <UserCheck className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'handshake':
      return <Handshake className={className} />;
    case 'hearthandshake':
      return <HeartHandshake className={className} />;
    case 'landmark':
    case 'bank':
      return <Landmark className={className} />;
    case 'coins':
    case 'badgedollarsign':
    case 'dollar':
      return <BadgeDollarSign className={className} />;
    case 'filetext':
    case 'document':
      return <FileText className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'shieldcheck':
      return <ShieldCheck className={className} />;
    case 'bookopen':
    case 'book':
      return <BookOpen className={className} />;
    case 'bookmark':
      return <Bookmark className={className} />;
    case 'plane':
    case 'airplane':
      return <Plane className={className} />;
    case 'sprout':
    case 'leaf':
      return <Sprout className={className} />;
    case 'building':
    case 'building2':
      return <Building2 className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'trendingup':
    case 'barchart':
      return <TrendingUp className={className} />;
    case 'atom':
    case 'science':
      return <Atom className={className} />;
    case 'percent':
      return <Percent className={className} />;
    case 'paperclip':
      return <Paperclip className={className} />;
    default:
      return <GraduationCap className={className} />;
  }
};
