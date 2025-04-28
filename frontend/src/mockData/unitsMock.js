import { memberImages } from './memberImages';

export const units = [
  {
    _id: '679946b7aa76f40b4d292abd',
    members: [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'jsmith@example.com',
        phoneNumber: [
          {
            number: '(716) 555-1234',
            type: 'Home'
          }
        ],
        honorary: false,
        memberSince: 2010
      },
      {
        firstName: 'Mary',
        lastName: 'Smith',
        email: 'msmith@example.com',
        phoneNumber: [
          {
            number: '(716) 555-5678',
            type: 'Home'
          }
        ],
        honorary: false,
        memberSince: 2010
      }
    ],
    addresses: [
      {
        addressType: 'Primary',
        street: '123 Main Street',
        city: 'Buffalo',
        state: 'NY',
        zip: '14201'
      }
    ],
    bio: 'The Smiths have been members since 2010 and enjoy both winter skiing and summer hiking in the area.',
    image: memberImages.smithFamily,
    thumbnail: memberImages.smithFamily
  },
  {
    _id: '679946b7aa76f40b4d292abe',
    members: [
      {
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'mthompson@gmail.com',
        phoneNumber: [
          {
            number: '(585) 555-1234',
            type: 'Mobile'
          }
        ],
        honorary: false,
        memberSince: 2010
      },
      {
        firstName: 'Sarah',
        lastName: 'Thompson',
        email: 'sthompson@outlook.com',
        phoneNumber: [
          {
            number: '(585) 555-5678',
            type: 'Mobile'
          }
        ],
        honorary: false,
        memberSince: 2010
      }
    ],
    addresses: [
      {
        addressType: 'Primary',
        street: '123 Highland Ave',
        city: 'Rochester',
        state: 'NY',
        zip: '14618'
      },
      {
        addressType: 'Secondary',
        street: '456 Lake Road',
        city: 'Canandaigua',
        state: 'NY',
        zip: '14424'
      }
    ],
    bio: 'The Thompsons have been skiing at Ellicottville for over a decade and love hosting friends at their unit.',
    image: memberImages.thompsonFamily,
    thumbnail: memberImages.thompsonFamily
  },
  {
    _id: '679946b7aa76f40b4d292abf',
    members: [
      {
        firstName: 'Robert',
        lastName: 'Miller',
        email: 'rmiller@yahoo.com',
        phoneNumber: [
          {
            number: '(716) 555-9876',
            type: 'Home'
          },
          {
            number: '(716) 555-5432',
            type: 'Work'
          }
        ],
        honorary: true,
        memberSince: 1995
      }
    ],
    addresses: [
      {
        addressType: 'Primary',
        street: '789 Delaware Ave',
        city: 'Buffalo',
        state: 'NY',
        zip: '14209'
      }
    ],
    bio: 'Bob has been an honorary member since 1995 and has served on the club board for 15 years.',
    image: memberImages.miller,
    thumbnail: memberImages.miller
  },
  {
    _id: '679946b7aa76f40b4d292ac0',
    members: [
      {
        firstName: 'Jennifer',
        lastName: 'Davis',
        email: 'jdavis@gmail.com',
        phoneNumber: [
          {
            number: '(315) 555-7890',
            type: 'Mobile'
          }
        ],
        honorary: false,
        memberSince: 2018
      },
      {
        firstName: 'Mark',
        lastName: 'Davis',
        email: 'mdavis@gmail.com',
        phoneNumber: [
          {
            number: '(315) 555-4321',
            type: 'Mobile'
          }
        ],
        honorary: false,
        memberSince: 2018
      },
      {
        firstName: 'Emma',
        lastName: 'Davis',
        email: '',
        phoneNumber: [],
        honorary: false,
        memberSince: 2018
      }
    ],
    addresses: [
      {
        addressType: 'Primary',
        street: '567 James Street',
        city: 'Syracuse',
        state: 'NY',
        zip: '13203'
      }
    ],
    bio: 'The Davis family joined in 2018 and are active in club social events.',
    image: memberImages.davisFamily,
    thumbnail: memberImages.davisFamily
  },
  {
    _id: '679946b7aa76f40b4d292ac1',
    members: [
      {
        firstName: 'William',
        lastName: 'Johnson',
        email: 'wjohnson@icloud.com',
        phoneNumber: [
          {
            number: '(607) 555-3456',
            type: 'Home'
          }
        ],
        honorary: false,
        memberSince: 2001
      },
      {
        firstName: 'Patricia',
        lastName: 'Johnson',
        email: 'pjohnson@icloud.com',
        phoneNumber: [
          {
            number: '(607) 555-7654',
            type: 'Mobile'
          }
        ],
        honorary: false,
        memberSince: 2001
      }
    ],
    addresses: [
      {
        addressType: 'Primary',
        street: '890 University Ave',
        city: 'Ithaca',
        state: 'NY',
        zip: '14850'
      }
    ],
    bio: 'The Johnsons are avid skiers who participate in the annual club race events.',
    image: memberImages.johnsonFamily,
    thumbnail: memberImages.johnsonFamily
  }
];
