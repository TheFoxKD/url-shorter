import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Url } from './url.entity';

@Entity('analytics')
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'url_id' })
  @Index('IDX_ANALYTICS_URL_ID')
  urlId: string;

  @ManyToOne(() => Url, (url) => url.analytics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'url_id' })
  url: Url;

  @Column({
    type: 'varchar',
    length: 45,
    name: 'ip_address',
  })
  @Index('IDX_ANALYTICS_IP')
  ipAddress: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'user_agent',
  })
  userAgent?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    name: 'country_code',
  })
  countryCode?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'referrer',
  })
  referrer?: string;

  @CreateDateColumn({ name: 'clicked_at' })
  @Index('IDX_ANALYTICS_CLICKED_AT')
  clickedAt: Date;

  /**
   * Get a masked IP address for privacy (keeps first 3 octets for IPv4)
   */
  get maskedIpAddress(): string {
    if (this.ipAddress.includes(':')) {
      // IPv6 - mask last 4 groups
      const parts = this.ipAddress.split(':');
      return parts.slice(0, 4).join(':') + '::***';
    } else {
      // IPv4 - mask last octet
      const parts = this.ipAddress.split('.');
      return parts.slice(0, 3).join('.') + '.***';
    }
  }
}
