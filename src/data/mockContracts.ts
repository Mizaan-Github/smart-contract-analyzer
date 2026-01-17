import { Contract } from '@/types/contracts';

export const mockContracts: Contract[] = [
  {
    id: '1',
    name: 'CDI - Développeur Senior',
    fileName: 'contrat_cdi_dev.pdf',
    status: 'completed',
    uploadedAt: new Date('2024-01-10'),
    analyzedAt: new Date('2024-01-10'),
    analysis: {
      score: 78,
      verdict: 'NÉGOCIER',
      type: 'CDI',
      resume: 'Contrat standard avec quelques clauses à revoir. La clause de non-concurrence est particulièrement restrictive.',
      clauses: [
        {
          id: 'c1',
          texte: 'Le salarié s\'engage à ne pas exercer d\'activité concurrente pendant une durée de 24 mois suivant la rupture du contrat, sur l\'ensemble du territoire national.',
          risque: 'ÉLEVÉ',
          probleme: 'Durée et périmètre géographique excessifs pour une clause de non-concurrence.',
          conseil: 'Négocier une réduction à 12 mois et un périmètre régional.'
        },
        {
          id: 'c2',
          texte: 'Les heures supplémentaires seront compensées par un repos équivalent à prendre dans les 3 mois.',
          risque: 'MOYEN',
          probleme: 'Pas de majoration prévue pour les heures supplémentaires.',
          conseil: 'Demander une majoration de 25% ou un paiement en heures supplémentaires.'
        },
        {
          id: 'c3',
          texte: 'Le télétravail peut être accordé sur demande motivée du salarié.',
          risque: 'FAIBLE',
          probleme: 'Clause vague sur les modalités du télétravail.',
          conseil: 'Clarifier le nombre de jours possibles par semaine.'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Bail Commercial - Local Centre',
    fileName: 'bail_commercial_paris.pdf',
    status: 'completed',
    uploadedAt: new Date('2024-01-08'),
    analyzedAt: new Date('2024-01-08'),
    analysis: {
      score: 45,
      verdict: 'REFUSER',
      type: 'Bail',
      resume: 'Bail déséquilibré en faveur du bailleur. Plusieurs clauses abusives détectées.',
      clauses: [
        {
          id: 'c4',
          texte: 'Le locataire supportera l\'intégralité des travaux de mise aux normes, quelle qu\'en soit la nature.',
          risque: 'ÉLEVÉ',
          probleme: 'Transfert illégal des charges du propriétaire vers le locataire.',
          conseil: 'Refuser cette clause, les gros travaux incombent au bailleur.'
        },
        {
          id: 'c5',
          texte: 'Le loyer sera révisé annuellement selon l\'indice le plus favorable au bailleur entre ILC et ICC.',
          risque: 'ÉLEVÉ',
          probleme: 'Clause de révision abusive permettant au bailleur de choisir l\'indice.',
          conseil: 'Exiger un seul indice fixe (ILC recommandé).'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Assurance Habitation',
    fileName: 'assurance_habitat_2024.pdf',
    status: 'completed',
    uploadedAt: new Date('2024-01-05'),
    analyzedAt: new Date('2024-01-05'),
    analysis: {
      score: 92,
      verdict: 'SIGNER',
      type: 'Assurance',
      resume: 'Contrat d\'assurance équilibré avec de bonnes garanties. Quelques précisions à demander sur les exclusions.',
      clauses: [
        {
          id: 'c6',
          texte: 'Les dommages causés par les eaux d\'infiltration sont couverts sauf défaut d\'entretien manifeste.',
          risque: 'FAIBLE',
          probleme: 'La notion de "défaut d\'entretien manifeste" peut être interprétée largement.',
          conseil: 'Demander des précisions sur les critères d\'évaluation.'
        }
      ]
    }
  },
  {
    id: '4',
    name: 'CDD - Mission Consulting',
    fileName: 'cdd_mission_6mois.pdf',
    status: 'analyzing',
    uploadedAt: new Date('2024-01-12'),
    progress: 65
  },
  {
    id: '5',
    name: 'Contrat Freelance',
    fileName: 'contrat_freelance_startup.pdf',
    status: 'pending',
    uploadedAt: new Date('2024-01-12')
  }
];
