import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Analytics } from './analytics.entity';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'original_url' })
  originalUrl: string;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'short_code' })
  @Index('IDX_URL_SHORT_CODE')
  shortCode: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
    name: 'custom_alias',
  })
  @Index('IDX_URL_ALIAS')
  alias?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'expires_at',
  })
  expiresAt?: Date;

  @Column({
    type: 'integer',
    default: 0,
    name: 'click_count',
  })
  clickCount: number;

  // Relationship to analytics records
  @OneToMany(() => Analytics, (analytics) => analytics.url, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  analytics: Analytics[];

  /**
   * Check if the URL has expired
   */
  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  /**
   * Get the short URL identifier (alias or shortCode)
   */
  get shortIdentifier(): string {
    return this.alias || this.shortCode;
  }
}
